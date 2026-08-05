#!/usr/bin/env bash
set -Eeuo pipefail

if [ "$(id -u)" -ne 0 ]; then
  echo "Run this script as root" >&2
  exit 1
fi

commit="${1:?Usage: deploy-production.sh COMMIT_SHA}"
case "$commit" in
  (*[!0-9a-fA-F]*|'') echo "Invalid commit SHA" >&2; exit 1 ;;
esac

repo="https://github.com/ed1ct7/piloproject"
domain="https://pilorama-razbegaevo.ru"
site="/var/www/piloproject"
timestamp="$(date +%Y%m%d-%H%M%S)"
short_commit="${commit:0:7}"
work_dir="$(mktemp -d /tmp/piloproject-release.XXXXXX)"
source_dir="$work_dir/source"
archive="$work_dir/source.tar.gz"
staging="/var/www/piloproject.staging-$timestamp-$short_commit"
backup="/var/www/piloproject.backup-$timestamp"
failed="/var/www/piloproject.failed-$timestamp"
old_moved=0
new_active=0

rollback() {
  code=$?
  trap - EXIT
  if [ "$code" -ne 0 ]; then
    set +e
    echo "DEPLOY FAILED: $code" >&2
    if [ "$new_active" -eq 1 ] && [ -d "$site" ]; then
      mv "$site" "$failed"
    fi
    if [ "$old_moved" -eq 1 ] && [ -d "$backup" ]; then
      mv "$backup" "$site"
      chown -R www-data:www-data "$site"
      nginx -t && systemctl reload nginx
      echo "ROLLBACK COMPLETE" >&2
    fi
  fi
  rm -rf -- "$work_dir" "$staging" "$failed"
  exit "$code"
}
trap rollback EXIT

test -d "$site"
test ! -e "$staging"
test ! -e "$backup"

curl -LfsS "$repo/archive/$commit.tar.gz" -o "$archive"
mkdir -p "$source_dir"
tar -xzf "$archive" -C "$source_dir" --strip-components=1

cd "$source_dir"
npm --prefix frontend ci
npm run check
NUXT_PUBLIC_API_BASE="$domain" npm --prefix frontend run generate

public="frontend/.output/public"
for required in index.html sitemap.xml robots.txt; do
  test -s "$public/$required"
done
for directory in _nuxt images pilomaterialy cart; do
  test -d "$public/$directory"
done
grep -RaqF "$domain" "$public"
if grep -RaqE 'https?://(localhost|127\.0\.0\.1):8080' "$public"; then
  echo "localhost API found in production output" >&2
  exit 1
fi

mv "$public" "$staging"
nginx -t

mv "$site" "$backup"
old_moved=1
mv "$staging" "$site"
new_active=1
chown -R www-data:www-data "$site"

nginx -t
systemctl reload nginx

check_200() {
  label="$1"
  url="$2"
  code="$(curl -LfsS -o /dev/null -w '%{http_code}' "$url")"
  test "$code" = 200
  printf '%s: %s\n' "$label" "$code"
}

for route in / /pilomaterialy /foto /dostavka /kontakty /otzyvy /cart /korzina /sitemap.xml /robots.txt /api/health; do
  check_200 "$route" "$domain$route"
done

js_file="$(find "$site/_nuxt" -type f -name '*.js' -print -quit)"
image_file="$(find "$site/images" -type f -print -quit)"
test -n "$js_file"
test -n "$image_file"
check_200 JS "$domain${js_file#$site}"
check_200 IMAGE "$domain${image_file#$site}"

for service in nginx piloproject-backend postgresql; do
  state="$(systemctl is-active "$service")"
  test "$state" = active
  printf '%s: %s\n' "$service" "$state"
done

printf '%s\n' "$commit" > /var/www/.piloproject-deployed-commit
rm -rf -- "$work_dir"
trap - EXIT

echo "DEPLOY COMPLETE"
echo "COMMIT: $commit"
echo "BACKUP: $backup"
