#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

if ! swapon --show=NAME --noheadings | grep -qx /swapfile; then
  if [ ! -f /swapfile ]; then
    fallocate -l 1G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
  fi
  swapon /swapfile
fi

if ! grep -q '^/swapfile ' /etc/fstab; then
  printf '/swapfile none swap sw 0 0\n' >> /etc/fstab
fi

timedatectl set-timezone Europe/Moscow
apt-get update
apt-get -y upgrade
apt-get install -y nginx postgresql postgresql-client certbot python3-certbot-nginx ufw ca-certificates curl openssl

systemctl enable --now postgresql nginx

if ! id piloproject >/dev/null 2>&1; then
  useradd --system --home-dir /opt/piloproject --shell /usr/sbin/nologin piloproject
fi

install -d -o piloproject -g piloproject -m 0755 /opt/piloproject
install -d -o www-data -g www-data -m 0755 /var/www/piloproject
install -d -o root -g piloproject -m 0750 /etc/piloproject

if [ ! -f /etc/piloproject/backend.env ]; then
  db_password="$(openssl rand -hex 24)"
  admin_password="$(openssl rand -hex 24)"

  runuser -u postgres -- psql -v ON_ERROR_STOP=1 --set=db_password="$db_password" <<'SQL'
SELECT format('CREATE ROLE piloproject LOGIN PASSWORD %L', :'db_password')
WHERE NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'piloproject') \gexec
SELECT 'CREATE DATABASE piloproject OWNER piloproject'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'piloproject') \gexec
SQL

  cat > /etc/piloproject/backend.env <<EOF
DATABASE_URL=postgres://piloproject:${db_password}@127.0.0.1:5432/piloproject
ADMIN_USERNAME=admin
ADMIN_PASSWORD=${admin_password}
ALLOWED_ORIGINS=https://pilorama-razbegaevo.ru,https://www.pilorama-razbegaevo.ru
EOF
  chown root:piloproject /etc/piloproject/backend.env
  chmod 0640 /etc/piloproject/backend.env

  cat > /root/piloproject-admin-credentials.txt <<EOF
Site: https://pilorama-razbegaevo.ru/admin
Username: admin
Password: ${admin_password}
EOF
  chmod 0600 /root/piloproject-admin-credentials.txt
fi

runuser -u postgres -- psql -v ON_ERROR_STOP=1 <<'SQL'
ALTER SYSTEM SET shared_buffers = '64MB';
ALTER SYSTEM SET work_mem = '2MB';
ALTER SYSTEM SET maintenance_work_mem = '32MB';
ALTER SYSTEM SET effective_cache_size = '256MB';
ALTER SYSTEM SET max_connections = '30';
SQL
systemctl restart postgresql

ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

printf 'VPS bootstrap complete\n'
