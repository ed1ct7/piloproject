# Развертка проекта

Инструкция описывает базовый production-сценарий: статический frontend Nuxt 3 размещается
на веб-сервере или статик-хостинге, backend Rust/Axum запускается отдельным сервисом и
доступен frontend-приложению по HTTP API.

## 1. Требования к серверу

- Linux-сервер с доступом по SSH.
- Node.js 22.12 или новее и `npm`/`npx` для сборки frontend.
- Rust toolchain для сборки backend или заранее собранный release-бинарник.
- Веб-сервер для статики и проксирования API, например Nginx.
- Домен и HTTPS-сертификат для публичной установки.

Если сборка выполняется не на сервере, на сервер достаточно передать:

- содержимое `frontend/.output/public`;
- release-бинарник backend из `backend/target/release/backend`;
- unit-файл systemd или другой способ запуска backend-сервиса.

## 2. Переменные окружения

Frontend читает базовый URL backend из `NUXT_PUBLIC_API_BASE`. Значение фиксируется во
время статической генерации, поэтому его нужно задать перед `npm run generate`.

Пример для production:

```bash
export NUXT_PUBLIC_API_BASE=https://example.com
```

Если API вынесен на отдельный домен:

```bash
export NUXT_PUBLIC_API_BASE=https://api.example.com
```

Backend по текущей реализации слушает `0.0.0.0:8080`. При публичной установке обычно
оставляют backend на внутреннем порту, а наружу открывают только Nginx с HTTPS.

## 3. Сборка backend

```bash
cd backend
cargo build --release
```

Результат сборки:

```bash
backend/target/release/backend
```

Перед выкладкой желательно выполнить проверки:

```bash
cargo fmt --check
cargo clippy -- -D warnings
cargo test
```

## 4. Запуск backend через systemd

Скопируйте бинарник, например в `/opt/piloproject/backend`:

```bash
sudo mkdir -p /opt/piloproject
sudo cp backend/target/release/backend /opt/piloproject/backend
sudo chmod +x /opt/piloproject/backend
```

Пример unit-файла `/etc/systemd/system/piloproject-backend.service`:

```ini
[Unit]
Description=piloproject backend
After=network.target

[Service]
Type=simple
WorkingDirectory=/opt/piloproject
ExecStart=/opt/piloproject/backend
Restart=always
RestartSec=5
User=www-data
Group=www-data

[Install]
WantedBy=multi-user.target
```

Применение unit-файла:

```bash
sudo systemctl daemon-reload
sudo systemctl enable piloproject-backend
sudo systemctl start piloproject-backend
sudo systemctl status piloproject-backend
```

Проверка backend на сервере:

```bash
curl http://127.0.0.1:8080/api/health
```

Ожидаемый ответ:

```json
{"status":"ok","service":"backend"}
```

## 5. Сборка frontend

Сначала установите зависимости:

```bash
cd frontend
npm ci
```

Затем выполните статическую генерацию с production-адресом API:

```bash
NUXT_PUBLIC_API_BASE=https://example.com npm run generate
```

Результат сборки:

```bash
frontend/.output/public
```

Перед выкладкой желательно выполнить проверку типов:

```bash
npm run typecheck
```

## 6. Размещение frontend

Скопируйте статические файлы в директорию сайта:

```bash
sudo mkdir -p /var/www/piloproject
sudo rsync -a --delete frontend/.output/public/ /var/www/piloproject/
```

Для статик-хостинга вместо Nginx загрузите содержимое `frontend/.output/public` в корень
сайта. Важно, чтобы `NUXT_PUBLIC_API_BASE` был задан до генерации, иначе frontend будет
обращаться к адресу по умолчанию `http://localhost:8080`.

## 7. Пример Nginx-конфигурации

Вариант с одним доменом: frontend отдается как статика, а запросы `/api/` проксируются
на backend.

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    root /var/www/piloproject;
    index index.html;

    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

После изменения конфигурации:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

Для HTTPS подключите сертификат через Certbot или другой ACME-клиент и настройте редирект
с HTTP на HTTPS.

## 8. Проверка после развертки

Проверьте API:

```bash
curl https://example.com/api/health
```

Проверьте главную страницу:

```bash
curl -I https://example.com/
```

В браузере откройте `https://example.com/`: страница должна загрузиться, запросить
`/api/health` и показать состояние backend-сервиса.

## 9. Обновление версии

Типовой порядок обновления:

1. Получить свежий код на сервере или в CI.
2. Выполнить `cargo build --release`.
3. Остановить backend: `sudo systemctl stop piloproject-backend`.
4. Заменить `/opt/piloproject/backend` новым бинарником.
5. Запустить backend: `sudo systemctl start piloproject-backend`.
6. Выполнить `npm ci` и `NUXT_PUBLIC_API_BASE=... npm run generate`.
7. Обновить `/var/www/piloproject` содержимым `frontend/.output/public`.
8. Проверить `/api/health` и главную страницу.

## 10. Частые проблемы

- Frontend показывает `Backend unreachable`: backend не запущен, Nginx не проксирует
  `/api/` или frontend был сгенерирован с неверным `NUXT_PUBLIC_API_BASE`.
- `curl http://127.0.0.1:8080/api/health` не отвечает: проверьте статус
  `piloproject-backend` и логи `journalctl -u piloproject-backend -e`.
- После обновления сайт выглядит старым: проверьте, что в `/var/www/piloproject`
  скопирована свежая директория `frontend/.output/public`.
- HTTPS не работает: проверьте DNS-записи домена, выпуск сертификата и Nginx-конфигурацию.
