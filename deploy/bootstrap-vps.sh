#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

timedatectl set-timezone Europe/Moscow
apt-get update
apt-get -y upgrade
apt-get install -y nginx certbot python3-certbot-nginx ufw ca-certificates curl

systemctl enable --now nginx
install -d -o www-data -g www-data -m 0755 /var/www/piloproject

ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

printf 'Static VPS bootstrap complete\n'
