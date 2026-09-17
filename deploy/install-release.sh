#!/usr/bin/env bash
set -euo pipefail

domain="pilorama-razbegaevo.ru"
www_domain="www.pilorama-razbegaevo.ru"
certbot_email="${CERTBOT_EMAIL:-shidov_roman@mail.ru}"
site="/var/www/piloproject"

if [ ! -s "/etc/letsencrypt/live/$domain/fullchain.pem" ]; then
  # Заглушка нужна только до выпуска сертификата: certbot проверяет домен по
  # HTTP, и в каталоге сайта должен быть хоть какой-то index.html. Раньше она
  # писалась безусловно — на уже работающем сайте повторный запуск скрипта
  # затирал главную страницу текстом «Сайт устанавливается».
  cat > "$site/index.html" <<'HTML'
<!doctype html>
<html lang="ru"><meta charset="utf-8"><title>Установка сайта</title><p>Сайт устанавливается.</p>
HTML
  chown -R www-data:www-data "$site"

  cat > /etc/nginx/sites-available/piloproject <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name $domain $www_domain;
    root $site;
    access_log off;
    location / { try_files \$uri \$uri/ =404; }
}
EOF
  ln -sfn /etc/nginx/sites-available/piloproject /etc/nginx/sites-enabled/piloproject
  rm -f /etc/nginx/sites-enabled/default
  nginx -t
  systemctl reload nginx
  certbot --nginx --non-interactive --agree-tos --email "$certbot_email" \
    -d "$domain" -d "$www_domain"
fi

# Security-заголовки — отдельным include-файлом, устанавливаем ДО основного
# конфига: он на него ссылается через `include`, и без снипета `nginx -t`
# упадёт с ошибкой отсутствующего файла.
install -d -o root -g root -m 0755 /etc/nginx/snippets
install -o root -g root -m 0644 /root/nginx-security-headers.conf /etc/nginx/snippets/piloproject-security-headers.conf

install -o root -g root -m 0644 /root/nginx-piloproject.conf /etc/nginx/sites-available/piloproject
ln -sfn /etc/nginx/sites-available/piloproject /etc/nginx/sites-enabled/piloproject
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
