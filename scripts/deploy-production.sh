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
npm --prefix frontend run generate

public="frontend/.output/public"
for required in index.html sitemap.xml robots.txt; do
  test -s "$public/$required"
done
for directory in _nuxt images pilomaterialy cart; do
  test -d "$public/$directory"
done
grep -RaqF "$domain" "$public"
python3 - "$public" "$domain" <<'PY'
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import re
import sys

public = Path(sys.argv[1])
allowed_host = urlparse(sys.argv[2]).hostname
errors = []

class ResourceScanner(HTMLParser):
    resource_attributes = {
        "script": {"src"}, "img": {"src", "srcset"}, "source": {"src", "srcset"},
        "link": {"href"}, "video": {"src", "poster"}, "audio": {"src"},
        "iframe": {"src"}, "form": {"action"},
    }

    def __init__(self, path):
        super().__init__()
        self.path = path

    def handle_starttag(self, tag, attrs):
        if tag in {"iframe", "form"}:
            errors.append(f"{self.path}: forbidden <{tag}>")
        checked = self.resource_attributes.get(tag, set())
        for name, value in attrs:
            if name not in checked or not value:
                continue
            for candidate in value.split(","):
                url = candidate.strip().split()[0]
                parsed = urlparse(url)
                if parsed.scheme in {"http", "https"} and parsed.hostname != allowed_host:
                    errors.append(f"{self.path}: external {tag} {name}={url}")

markers = re.compile(
    r"/api/(?:health|reviews)|map-widget|mc\.yandex|metrika|googletagmanager|"
    r"google-analytics|facebook\.net|vk\.com/rtrg|top\.mail\.ru|clarity\.ms|hotjar|sendBeacon",
    re.IGNORECASE,
)

for path in public.rglob("*"):
    if path.suffix not in {".html", ".js", ".css", ".json"}:
        continue
    text = path.read_text(encoding="utf-8", errors="ignore")
    if markers.search(text):
        errors.append(f"{path}: tracking or removed API marker")
    if path.suffix == ".html":
        scanner = ResourceScanner(path)
        scanner.feed(text)

if errors:
    print("Privacy guard failed:", file=sys.stderr)
    print("\n".join(errors), file=sys.stderr)
    raise SystemExit(1)
PY

mv "$public" "$staging"

# Старые файлы /_nuxt/ переносим в новый релиз и держим 30 дней с момента,
# когда их перестала использовать сборка. Иначе HTML, скачанный до деплоя
# (кэш браузера, отложенный JS-рендер робота Яндекса), ссылается на удалённые
# чанки — Nuxt падает при старте, см. docs/seo-plan-2026-09.md, §11.
# Список перенесённых файлов лежит вне корня сайта: у файла из списка уже
# стоит mtime «перестал использоваться», у файла прошлой сборки его ставим
# сейчас, и по нему же считаем 30 дней.
carried_list="/var/www/.piloproject-carried-assets"
new_carried_list="$work_dir/carried-assets"
: > "$new_carried_list"
while IFS= read -r -d '' old_file; do
  name="${old_file#"$site/_nuxt/"}"
  case "$name" in (builds/latest.json) continue ;; esac
  target="$staging/_nuxt/$name"
  test -e "$target" && continue
  mkdir -p "$(dirname "$target")"
  cp -p "$old_file" "$target"
  if ! grep -qxF "$name" "$carried_list" 2>/dev/null; then
    touch "$target"
  fi
  if [ -n "$(find "$target" -mtime +30)" ]; then
    rm -f -- "$target"
  else
    printf '%s\n' "$name" >> "$new_carried_list"
  fi
done < <(find "$site/_nuxt" -type f -print0)
printf 'Carried over %s old /_nuxt files\n' "$(wc -l < "$new_carried_list")"

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

for route in / /pilomaterialy /foto /dostavka /kontakty /cart /korzina /sitemap.xml /robots.txt; do
  check_200 "$route" "$domain$route"
done

js_file="$(find "$site/_nuxt" -type f -name '*.js' -print -quit)"
image_file="$(find "$site/images" -type f -print -quit)"
test -n "$js_file"
test -n "$image_file"
check_200 JS "$domain${js_file#$site}"
check_200 IMAGE "$domain${image_file#$site}"

for service in nginx; do
  state="$(systemctl is-active "$service")"
  test "$state" = active
  printf '%s: %s\n' "$service" "$state"
done

# Ротация: имена бэкапов содержат timestamp, сортировка по имени — хронологическая.
ls -d /var/www/piloproject.backup-* 2>/dev/null | sort | head -n -3 | xargs -r rm -rf --

printf '%s\n' "$commit" > /var/www/.piloproject-deployed-commit
cp "$new_carried_list" "$carried_list"
rm -rf -- "$work_dir"
trap - EXIT

echo "DEPLOY COMPLETE"
echo "COMMIT: $commit"
echo "BACKUP: $backup"
