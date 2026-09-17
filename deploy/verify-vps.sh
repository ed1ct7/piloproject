#!/usr/bin/env bash
set -euo pipefail

# Проверки production-сервера после установки deploy/nginx-piloproject.conf
# и деплоя статики. Запускается на сервере (bash + curl + openssl).

site="/var/www/piloproject"
base="https://pilorama-razbegaevo.ru"

# Печатает понятную причину падения в stderr и завершает скрипт с ошибкой —
# так первая непройденная проверка сразу видна в выводе.
fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

# Код ответа $1 должен быть равен $2 (без -L: редиректы не разворачиваем,
# нас интересует именно код самого запрошенного URL).
require_status() {
  local url="$1" expected="$2" code
  code="$(curl --silent --output /dev/null --write-out '%{http_code}' "$url")"
  test "$code" = "$expected" || fail "$url отдал код $code, ожидался $expected"
}

# В ответе на $2 (обычный GET) должен присутствовать заголовок $1
# (сравнение регистронезависимое, как и у самих HTTP-заголовков).
require_header() {
  local header="$1" url="$2" headers
  headers="$(curl --fail --silent --show-error -D - -o /dev/null "$url")" \
    || fail "не удалось получить $url для проверки заголовка $header"
  printf '%s' "$headers" | tr -d '\r' | grep -qi "^${header}:" \
    || fail "заголовок $header отсутствует в ответе $url"
}

test "$(systemctl is-active nginx)" = active || fail "nginx не активен"

for route in / /pilomaterialy /foto /dostavka /kontakty /sitemap.xml /robots.txt; do
  curl --fail --silent "$base$route" >/dev/null || fail "маршрут $route недоступен"
done

for removed_route in /api/health /api/reviews /admin /system-status /otzyvy /missing-page-check; do
  require_status "$base$removed_route" 404
done

test "$(curl --silent --output /dev/null --write-out '%{http_code}' \
  --resolve www.pilorama-razbegaevo.ru:443:127.0.0.1 \
  https://www.pilorama-razbegaevo.ru/)" = 301 \
  || fail "www.pilorama-razbegaevo.ru не отдаёт 301 на основной домен"

# --- Сжатие и HTTP/2 (docs/seo-audit-2026-09-16.md, раздел 8, п. 1) ---

js_file="$(find "$site/_nuxt" -type f -name '*.js' -print -quit 2>/dev/null || true)"
test -n "$js_file" || fail "не найден JS-файл в $site/_nuxt для проверки gzip"
js_url="$base${js_file#"$site"}"

js_headers="$(curl --fail --silent --show-error -D - -o /dev/null -H 'Accept-Encoding: gzip' "$js_url")" \
  || fail "не удалось получить $js_url с Accept-Encoding: gzip"
printf '%s' "$js_headers" | tr -d '\r' | grep -qi '^Content-Encoding: *gzip' \
  || fail "нет Content-Encoding: gzip на $js_url (Accept-Encoding: gzip)"

openssl s_client -alpn h2 -connect pilorama-razbegaevo.ru:443 -servername pilorama-razbegaevo.ru \
  </dev/null 2>/dev/null | grep -q 'ALPN protocol: h2' \
  || fail "ALPN не подтвердил h2 — HTTP/2 недоступен на 443"

# --- Security-заголовки, включая /_nuxt/ и /_ipx/ (docs/security.md) ---

require_header 'Strict-Transport-Security' "$base/"
require_header 'Strict-Transport-Security' "$js_url"
require_header 'Content-Security-Policy' "$js_url"

ipx_file="$(find "$site/_ipx" -type f -print -quit 2>/dev/null || true)"
test -n "$ipx_file" || fail "не найден ни один файл в $site/_ipx для проверки заголовков"
require_header 'Strict-Transport-Security' "$base${ipx_file#"$site"}"

# --- Редиректы и коды ответа (docs/seo-audit-2026-09-16.md, раздел 3) ---

require_status "$base/index.html" 301
require_status "$base/doska/index.html" 301
require_status "$base//doska" 301
require_status "$base/200.html" 404
require_status "$base/404.html" 404
# Служебная страница тела 404 напрямую недоступна: сам `/not-found` отдаёт 404,
# а `/not-found/index.html` попадает под общее правило 301 для `index.html`
# (редирект отрабатывает раньше выбора location) и ведёт на `/not-found`.
require_status "$base/not-found" 404
require_status "$base/not-found/index.html" 301

# --- Тело страницы 404 (contract.md п. 7, seo-audit п. 9) ---

missing_url="$base/no-such-page-check"
require_status "$missing_url" 404
missing_body="$(curl --silent "$missing_url")"
printf '%s' "$missing_body" | grep -qi '<title' \
  || fail "тело 404 без <title> на $missing_url"
printf '%s' "$missing_body" | grep -q '/pilomaterialy' \
  || fail "тело 404 без ссылки на /pilomaterialy на $missing_url"

# --- Cache-Control на картинках (docs/seo-audit-2026-09-16.md, раздел 4) ---

require_header 'Cache-Control' "$base/images/video-poster.jpg"

# --- sitemap.xml без бессмысленного lastmod (autoLastmod: false) ---

sitemap_body="$(curl --fail --silent "$base/sitemap.xml")" \
  || fail "не удалось получить $base/sitemap.xml"
if printf '%s' "$sitemap_body" | grep -qi '<lastmod>'; then
  fail "sitemap.xml содержит <lastmod> — autoLastmod должен быть выключен"
fi

nginx -t
certbot renew --dry-run --quiet --no-random-sleep-on-renew
printf 'All static production checks passed\n'
