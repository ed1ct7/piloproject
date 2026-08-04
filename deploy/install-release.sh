#!/usr/bin/env bash
set -euo pipefail

install -o root -g root -m 0755 /root/backend /opt/piloproject/backend
install -o root -g root -m 0644 /root/schema.sql /opt/piloproject/schema.sql
install -o root -g root -m 0644 /root/piloproject-backend.service /etc/systemd/system/piloproject-backend.service
install -o root -g root -m 0644 /root/nginx-piloproject.conf /etc/nginx/sites-available/piloproject
ln -sfn /etc/nginx/sites-available/piloproject /etc/nginx/sites-enabled/piloproject
rm -f /etc/nginx/sites-enabled/default

cat > /var/www/piloproject/index.html <<'HTML'
<!doctype html>
<html lang="ru">
<meta charset="utf-8">
<title>Установка сайта</title>
<p>Сайт устанавливается.</p>
HTML
chown -R www-data:www-data /var/www/piloproject

set -a
. /etc/piloproject/backend.env
set +a
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f /opt/piloproject/schema.sql

systemctl daemon-reload
systemctl enable --now piloproject-backend
nginx -t
systemctl reload nginx
sleep 2
curl --fail --silent http://127.0.0.1:8080/api/health
