#!/usr/bin/env bash
set -euo pipefail

for service in postgresql nginx piloproject-backend; do
  test "$(systemctl is-active "$service")" = active
done

set -a
. /etc/piloproject/backend.env
set +a

curl --fail --silent http://127.0.0.1:8080/api/health >/dev/null
curl --fail --silent https://pilorama-razbegaevo.ru/api/health >/dev/null
curl --fail --silent https://pilorama-razbegaevo.ru/api/reviews >/dev/null
curl --fail --silent -u "${ADMIN_USERNAME}:${ADMIN_PASSWORD}" \
  https://pilorama-razbegaevo.ru/api/admin/session >/dev/null
curl --fail --silent https://pilorama-razbegaevo.ru/robots.txt >/dev/null
curl --fail --silent https://pilorama-razbegaevo.ru/sitemap.xml >/dev/null

test "$(curl --silent --output /dev/null --write-out '%{http_code}' \
  --resolve www.pilorama-razbegaevo.ru:443:127.0.0.1 \
  https://www.pilorama-razbegaevo.ru/)" = 301

runuser -u postgres -- psql -d piloproject -Atc \
  "SELECT to_regclass('public.reviews') IS NOT NULL" | grep -qx t

nginx -t
certbot renew --dry-run --quiet --no-random-sleep-on-renew

printf 'All production checks passed\n'
