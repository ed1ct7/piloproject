bash <<'DEPLOY'
set -Eeuo pipefail

site=/var/www/piloproject
archive=/tmp/piloproject-20260805-031916-449e652.tar.gz
staging=/var/www/piloproject.staging-20260805-031916-449e652
marker=/var/www/.piloproject-deployed-commit
timestamp=$(date +%Y%m%d-%H%M%S)
backup=/var/www/piloproject.backup-$timestamp
failed=/var/www/piloproject.failed-$timestamp
old_moved=0
new_active=0

remove_deploy_key() {
  sed -i '\|codex-piloproject-deploy-20260805$|d' /root/.ssh/authorized_keys
}

rollback() {
  code=$?
  if [ "$code" -ne 0 ]; then
    set +e
    echo "DEPLOY FAILED: $code"
    if [ "$new_active" -eq 1 ] && [ -d "$site" ]; then
      mv "$site" "$failed"
    fi
    if [ "$old_moved" -eq 1 ] && [ -d "$backup" ]; then
      mv "$backup" "$site"
      chown -R www-data:www-data "$site"
      nginx -t && systemctl reload nginx
      echo "ROLLBACK COMPLETE"
    fi
    rm -rf -- "$staging" "$failed"
    rm -f "$archive" "$marker"
    remove_deploy_key
  fi
  exit "$code"
}
trap rollback EXIT

test -f "$archive"
test -d "$site"
test ! -e "$staging"
test ! -e "$backup"

printf '%s  %s\n' \
  '88b7bc68897f4de4d8e34b6041af2105a3deff32d99283b3d32e01639f0bdfed' \
  "$archive" | sha256sum -c -

install -d -m 0755 "$staging"
tar -xzf "$archive" -C "$staging"

for required in index.html sitemap.xml robots.txt; do
  test -s "$staging/$required"
done

for directory in _nuxt _ipx images pilomaterialy cart korzina; do
  test -d "$staging/$directory"
done

grep -R -a -q 'https://pilorama-razbegaevo.ru' "$staging"

if grep -R -a -E -q 'https?://(localhost|127\.0\.0\.1):8080' "$staging"; then
  echo "Найден localhost API"
  exit 1
fi

grep -q 'Корзина (0)' "$staging/pilomaterialy/index.html"
grep -q 'Корзина пуста' "$staging/cart/index.html"

nginx -t

mv "$site" "$backup"
old_moved=1
mv "$staging" "$site"
new_active=1

printf '%s\n' '449e652ea68604a3fee0de243bcb226645f5468f' > "$marker"
chown -R www-data:www-data "$site"

nginx -t
systemctl reload nginx

check_200() {
  label=$1
  url=$2
  code=$(curl --location --fail --silent --show-error \
    --output /dev/null --write-out '%{http_code}' "$url")
  test "$code" = 200
  printf '%s: %s\n' "$label" "$code"
}

base=https://pilorama-razbegaevo.ru

check_200 / "$base/"
check_200 /pilomaterialy "$base/pilomaterialy"
check_200 /foto "$base/foto"
check_200 /dostavka "$base/dostavka"
check_200 /kontakty "$base/kontakty"
check_200 /otzyvy "$base/otzyvy"
check_200 /cart "$base/cart"
check_200 /sitemap.xml "$base/sitemap.xml"
check_200 /robots.txt "$base/robots.txt"
check_200 /api/health "$base/api/health"

js_file=$(find "$site/_nuxt" -type f -name '*.js' -print -quit)
image_file=$(find "$site/images" -type f -print -quit)

test -n "$js_file"
test -n "$image_file"

check_200 JS "$base${js_file#$site}"
check_200 IMAGE "$base${image_file#$site}"

for service in nginx piloproject-backend postgresql; do
  state=$(systemctl is-active "$service")
  test "$state" = active
  printf '%s: %s\n' "$service" "$state"
done

nginx -t
rm -f "$archive"
remove_deploy_key
trap - EXIT

echo "DEPLOY COMPLETE"
echo "COMMIT: 449e652ea68604a3fee0de243bcb226645f5468f"
echo "BACKUP: $backup"
DEPLOY




bash -lc 'set -euo pipefail; d=$(mktemp -d /tmp/pilo.XXXXXX); curl -LfsS https://github.com/ed1ct7/piloproject/archive/449e652ea68604a3fee0de243bcb226645f5468f.tar.gz | tar -xz -C "$d" --strip-components=1; cd "$d"; npm --prefix frontend ci; NUXT_PUBLIC_API_BASE=https://pilorama-razbegaevo.ru npm --prefix frontend run generate; p=frontend/.output/public; test -s "$p/index.html"; test -s "$p/sitemap.xml"; test -s "$p/robots.txt"; ! grep -RaqE "https?://(localhost|127\.0\.0\.1):8080" "$p"; s=/var/www/piloproject.staging-$(date +%Y%m%d-%H%M%S); mv "$p" "$s"; nginx -t; b=/var/www/piloproject.backup-$(date +%Y%m%d-%H%M%S); mv /var/www/piloproject "$b"; ok=0; if mv "$s" /var/www/piloproject && chown -R www-data:www-data /var/www/piloproject && nginx -t && systemctl reload nginx; then ok=1; for u in / /pilomaterialy /foto /dostavka /kontakty /otzyvy /cart /sitemap.xml /robots.txt /api/health; do [ "$(curl -Lso /dev/null -w "%{http_code}" "https://pilorama-razbegaevo.ru$u")" = 200 ] || ok=0; done; for x in nginx piloproject-backend postgresql; do [ "$(systemctl is-active "$x")" = active ] || ok=0; done; j=$(find /var/www/piloproject/_nuxt -type f -name "*.js" -print -quit); i=$(find /var/www/piloproject/images -type f -print -quit); [ -n "$j" ] && [ -n "$i" ] || ok=0; [ "$(curl -Lso /dev/null -w "%{http_code}" "https://pilorama-razbegaevo.ru${j#/var/www/piloproject}")" = 200 ] || ok=0; [ "$(curl -Lso /dev/null -w "%{http_code}" "https://pilorama-razbegaevo.ru${i#/var/www/piloproject}")" = 200 ] || ok=0; fi; if [ "$ok" = 1 ]; then printf "%s\n" 449e652ea68604a3fee0de243bcb226645f5468f >/var/www/.piloproject-deployed-commit; cd /; rm -rf "$d"; echo DEPLOY_OK; echo BACKUP="$b"; else rm -rf /var/www/piloproject; mv "$b" /var/www/piloproject; chown -R www-data:www-data /var/www/piloproject; nginx -t; systemctl reload nginx; cd /; rm -rf "$s" "$d"; echo ROLLBACK_DONE >&2; exit 1; fi'