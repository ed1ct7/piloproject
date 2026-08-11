#!/usr/bin/env bash
set -euo pipefail

test "$(systemctl is-active nginx)" = active
for route in / /pilomaterialy /foto /dostavka /kontakty /sitemap.xml /robots.txt; do
  curl --fail --silent "https://pilorama-razbegaevo.ru$route" >/dev/null
done

for removed_route in /api/health /api/reviews /admin /system-status /otzyvy /missing-page-check; do
  test "$(curl --silent --output /dev/null --write-out '%{http_code}' \
    "https://pilorama-razbegaevo.ru$removed_route")" = 404
done

test "$(curl --silent --output /dev/null --write-out '%{http_code}' \
  --resolve www.pilorama-razbegaevo.ru:443:127.0.0.1 \
  https://www.pilorama-razbegaevo.ru/)" = 301

nginx -t
certbot renew --dry-run --quiet --no-random-sleep-on-renew
printf 'All static production checks passed\n'
