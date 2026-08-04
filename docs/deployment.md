# Развертка проекта

Инструкция описывает базовый production-сценарий: статический frontend Nuxt 3 размещается
на веб-сервере или статик-хостинге, backend Rust/Axum запускается отдельным сервисом и
доступен frontend-приложению по HTTP API.

## 1. Требования к серверу

- Linux-сервер с доступом по SSH.
- Node.js 22.12 или новее и `npm`/`npx` для сборки frontend.
- Rust toolchain для сборки backend или заранее собранный release-бинарник.
- PostgreSQL для данных backend. ORM проекта — SeaORM.
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

Backend подключается к PostgreSQL через SeaORM. Подключение задается переменной
`DATABASE_URL`. Админка использует `ADMIN_USERNAME` и `ADMIN_PASSWORD` для Basic Auth
на защищенных операциях модерации. CORS ограничивается переменной `ALLOWED_ORIGINS`:

```bash
export DATABASE_URL=postgres://piloproject:password@127.0.0.1:5432/piloproject
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=change-me
export ALLOWED_ORIGINS=https://example.com
```

Перед первым запуском примените схему:

```bash
psql "$DATABASE_URL" -f backend/schema.sql
```

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
sudo cp backend/schema.sql /opt/piloproject/schema.sql
sudo chmod +x /opt/piloproject/backend
```

Создайте файл окружения `/etc/piloproject/backend.env`:

```bash
sudo mkdir -p /etc/piloproject
sudo nano /etc/piloproject/backend.env
```

```env
DATABASE_URL=postgres://piloproject:password@127.0.0.1:5432/piloproject
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-me
ALLOWED_ORIGINS=https://example.com
```

На сервере схему можно применить из скопированного файла:

```bash
set -a
. /etc/piloproject/backend.env
set +a
psql "$DATABASE_URL" -f /opt/piloproject/schema.sql
```

Пример unit-файла `/etc/systemd/system/piloproject-backend.service`:

```ini
[Unit]
Description=piloproject backend
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=/opt/piloproject
EnvironmentFile=/etc/piloproject/backend.env
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
curl http://127.0.0.1:8080/api/reviews
curl -u "$ADMIN_USERNAME:$ADMIN_PASSWORD" http://127.0.0.1:8080/api/admin/session
curl -I -H "Origin: https://example.com" http://127.0.0.1:8080/api/health
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

Внутри `npm run generate` также готовятся WebP-исходники и создаются статические
`_ipx`-варианты для ключевых `NuxtImg`-изображений. После сборки в
`frontend/.output/public/_ipx` должны быть WebP-файлы для главной страницы и страницы
отзывов.

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

В браузере откройте `https://example.com/`: главная страница должна загрузиться без
ошибок изображений. Затем откройте `https://example.com/system-status`: страница должна
запросить `/api/health` и показать состояние backend-сервиса. Админка должна открываться
по `https://example.com/admin` и принимать логин/пароль из backend-окружения.

## 9. Обновление версии

Типовой порядок обновления:

1. Получить свежий код на сервере или в CI.
2. Выполнить `cargo build --release`.
3. Применить изменения схемы PostgreSQL, если они есть.
4. Остановить backend: `sudo systemctl stop piloproject-backend`.
5. Заменить `/opt/piloproject/backend` новым бинарником.
6. Запустить backend: `sudo systemctl start piloproject-backend`.
7. Выполнить `npm ci` и `NUXT_PUBLIC_API_BASE=... npm run generate`.
8. Обновить `/var/www/piloproject` содержимым `frontend/.output/public`.
9. Проверить `/api/health`, `/api/reviews`, `/api/admin/session`, главную страницу и `/admin`.
10. Проверить, что `ALLOWED_ORIGINS` содержит только реальные frontend-домены без `*`.
11. Проверить security headers: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
    `Permissions-Policy`, `Content-Security-Policy`.

## 10. Частые проблемы

- Frontend показывает `Backend unreachable`: backend не запущен, Nginx не проксирует
  `/api/` или frontend был сгенерирован с неверным `NUXT_PUBLIC_API_BASE`.
- `curl http://127.0.0.1:8080/api/health` не отвечает: проверьте статус
  `piloproject-backend` и логи `journalctl -u piloproject-backend -e`.
- Backend падает при старте: проверьте `DATABASE_URL`, доступность PostgreSQL и наличие
  таблицы `reviews`. Также проверьте, что заданы `ADMIN_USERNAME`, `ADMIN_PASSWORD` и корректный
  `ALLOWED_ORIGINS` без wildcard.
- После обновления сайт выглядит старым: проверьте, что в `/var/www/piloproject`
  скопирована свежая директория `frontend/.output/public`.
- HTTPS не работает: проверьте DNS-записи домена, выпуск сертификата и Nginx-конфигурацию.

## 11. Стандартный промпт для production-деплоя

Передавайте SSH-доступ отдельно. Не добавляйте пароль, приватный ключ или содержимое
production-переменных в промпт, репозиторий и логи.

```text
Собери и разверни текущую ветку PiloProject на production.

Параметры production:
- домен: https://pilorama-razbegaevo.ru;
- frontend: статическая Nuxt-сборка в /var/www/piloproject;
- backend: systemd-сервис piloproject-backend;
- API снаружи: https://pilorama-razbegaevo.ru/api/;
- Nginx проксирует /api/ на backend.

Порядок работы:
1. Проверь текущую ветку, commit и git status. Не перезаписывай чужие
   незакоммиченные изменения.
2. Изучи изменения относительно развернутой версии. Не изменяй backend, базу данных,
   Nginx или systemd, если соответствующая часть проекта не менялась.
3. Установи зависимости только при необходимости и не обновляй версии пакетов без
   отдельного запроса.
4. Запусти npm run check из корня проекта. Деплой запрещен при падении тестов или
   проверки типов.
5. Собери frontend с
   NUXT_PUBLIC_API_BASE=https://pilorama-razbegaevo.ru командой
   npm --prefix frontend run generate.
6. До загрузки проверь, что в frontend/.output/public присутствуют index.html,
   sitemap.xml, robots.txt и ассеты, production API указан правильно, а localhost API
   отсутствует.
7. Упакуй только содержимое frontend/.output/public и загрузи архив во временное место
   на сервере.
8. На сервере распакуй выпуск в новый staging-каталог внутри /var/www. Не изменяй
   текущий каталог сайта до завершения проверки staging.
9. Выполни nginx -t. Создай резервную копию текущего /var/www/piloproject с временной
   меткой, затем атомарно замени его проверенным staging-каталогом.
10. Назначь владельца www-data:www-data, повторно выполни nginx -t и перезагрузи Nginx.
11. Проверь коды 200 для /, /pilomaterialy, /foto, /dostavka, /kontakty, /otzyvy,
    /sitemap.xml, /robots.txt и /api/health. Отдельно проверь JS-бандл и изображение.
12. Убедись, что nginx, piloproject-backend и postgresql активны. Если backend менялся,
    дополнительно проверь API отзывов и административную сессию без вывода учетных
    данных в лог.
13. При любой ошибке после переключения автоматически верни предыдущую директорию и
    перезагрузи Nginx.
14. Удали с сервера временные архивы и deployment-скрипты. Сохрани последнюю резервную
    копию для ручного отката.
15. В отчете укажи commit, результаты тестов и сборки, проверенные URL, состояние
    сервисов и путь к резервной копии. Не публикуй секреты.
```
