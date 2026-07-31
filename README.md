# piloproject

Монорепозиторий: фронтенд **Nuxt 3 (SSG)** + бэкенд **Rust (Axum)**.

Демо-связка: статически сгенерированный сайт Nuxt обращается к API на Rust/Axum.
Сквозная проверка работоспособности выполняется через эндпоинт `/api/health`: страница
«Состояние системы» запрашивает его и показывает состояние бэкенда — так проверяется, что
обе части собраны и связаны корректно.

## Стек

| Часть     | Технологии                                                   |
|-----------|--------------------------------------------------------------|
| Фронтенд  | Vue 3 + Vite + Nuxt 3 (SSG через `nuxt generate`), TypeScript, Nuxt SEO-модули |
| Бэкенд    | Rust, Axum, Tokio, Serde, tower-http (CORS), SeaORM, PostgreSQL |

Nuxt 3 включает в себя Vue 3 и Vite; SSG — это `generate` Nuxt (полный статический пререндер).
Карта сайта, `robots.txt`, Schema.org-разметка и оптимизация изображений настроены через
`@nuxtjs/sitemap`, `@nuxtjs/robots`, `nuxt-schema-org` и `@nuxt/image`.

## Требования

- **Node.js ≥ 22.12** — среда выполнения фронтенда; рекомендуется актуальный LTS-релиз.
- **npm** — менеджер пакетов фронтенда (устанавливается вместе с Node.js).
- **Rust (edition 2021)** — тулчейн для бэкенда, установка через [rustup](https://rustup.rs).
- **PostgreSQL** — основная БД backend. Доступ к БД задается через `DATABASE_URL`.

## Быстрый старт

Нужны два терминала: один для бэкенда, второй для фронтенда.

Терминал 1 — бэкенд:

```bash
cd backend
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/piloproject
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=change-me
export ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
psql "$DATABASE_URL" -f schema.sql
cargo run          # http://localhost:8080
```

В PowerShell:

```powershell
cd backend
$env:DATABASE_URL = "postgres://postgres:postgres@localhost:5432/piloproject"
$env:ADMIN_USERNAME = "admin"
$env:ADMIN_PASSWORD = "change-me"
$env:ALLOWED_ORIGINS = "http://localhost:3000,http://127.0.0.1:3000"
psql $env:DATABASE_URL -f schema.sql
cargo run          # http://localhost:8080
```

Терминал 2 — фронтенд:

```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

Открыть `http://localhost:3000/system-status` — страница «Состояние системы» запросит
`GET /api/health` у бэкенда и покажет его состояние. Если бэкенд не запущен, страница
сообщит о недоступности API.

## Переменные окружения

| Переменная             | Назначение                               | По умолчанию            |
|------------------------|------------------------------------------|-------------------------|
| `NUXT_PUBLIC_API_BASE` | Базовый URL backend, читается фронтендом | `http://localhost:8080` |
| `DATABASE_URL`         | PostgreSQL-подключение для backend       | нет, задается явно      |
| `ADMIN_USERNAME`       | Логин для админки и модерации отзывов    | нет, задается явно      |
| `ADMIN_PASSWORD`       | Пароль для админки и модерации отзывов   | нет, задается явно      |
| `ALLOWED_ORIGINS`      | Разрешенные CORS origins для backend через запятую | `localhost`, `127.0.0.1`, production-домен |

`NUXT_PUBLIC_API_BASE` попадает в runtime-config `public.apiBase` (см.
`frontend/nuxt.config.ts`) и используется в `composables/useApi.ts`. `DATABASE_URL`
читает backend при старте для подключения к PostgreSQL. `ADMIN_USERNAME` и
`ADMIN_PASSWORD` нужны backend для проверки Basic Auth на защищенных операциях админки. `ALLOWED_ORIGINS`
ограничивает браузерные запросы к API; wildcard `*` намеренно не используется.
Переменные можно задать через окружение или файл `.env` (он в `.gitignore` и в
репозиторий не коммитится).

## Скрипты

Фронтенд (`cd frontend`, запуск как `npm run <скрипт>`):

| Скрипт      | Действие                                             |
|-------------|------------------------------------------------------|
| `dev`       | Dev-сервер с HMR на `http://localhost:3000`          |
| `build`     | Сборка Nuxt (серверный/Node-режим)                   |
| `generate`  | Подготовка WebP-исходников, SSG и статические `_ipx`-варианты → `frontend/.output/public` |
| `preview`   | Локальный просмотр собранного сайта                  |
| `typecheck` | Проверка типов (`vue-tsc`, strict)                   |

`postinstall` (`nuxt prepare`) выполняется автоматически после `npm install`.

Для прямого запуска локального Nuxt CLI без глобальной установки используйте
`npx`: например, `npx nuxt dev`, `npx nuxt generate` или `npx nuxt typecheck`.
Перед этим зависимости проекта должны быть установлены командой `npm install`.

Бэкенд (`cd backend`):

| Команда                 | Действие                                           |
|-------------------------|----------------------------------------------------|
| `cargo run`             | Запуск сервера на `0.0.0.0:8080`                   |
| `cargo build --release` | Релизная сборка → `backend/target/release/backend` |
| `cargo test`            | Запуск тестов                                      |
| `cargo fmt`             | Форматирование кода                                |
| `cargo clippy`          | Линтер                                             |

## API

Базовый URL: `http://localhost:8080` (см. `NUXT_PUBLIC_API_BASE`).

| Метод | Путь          | Ответ                                      | Назначение                 |
|-------|---------------|--------------------------------------------|----------------------------|
| `GET` | `/api/health` | `{ "status": "ok", "service": "backend" }` | Проверка работоспособности |

Отзывы хранятся в PostgreSQL через SeaORM. Перед запуском backend создайте таблицу из
`backend/schema.sql`.

| Метод    | Путь               | Назначение            |
|----------|--------------------|-----------------------|
| `GET`    | `/api/admin/session` | Проверить логин администратора |
| `POST`   | `/api/reviews`     | Создать отзыв         |
| `GET`    | `/api/reviews`     | Получить список       |
| `GET`    | `/api/reviews/:id` | Получить один отзыв   |
| `PUT`    | `/api/reviews/:id` | Изменить отзыв, нужен Basic Auth администратора |
| `DELETE` | `/api/reviews/:id` | Удалить отзыв, нужен Basic Auth администратора |

Пример создания:

```json
{
  "authorName": "Анна",
  "text": "Хороший брус и быстрая доставка",
  "rating": 5
}
```

CORS ограничен списком `ALLOWED_ORIGINS`; по умолчанию разрешены локальные dev-адреса и
`https://pilorama-razbegaevo.clients.site`. Backend добавляет security headers и ограничивает JSON-тело
запроса 16 КБ. Поля отзывов ограничены: `authorName` до 80 символов, `text` до 1000 символов.

Админская страница доступна по `/admin`. Она не добавлена в sitemap, закрыта от
индексации и использует `ADMIN_USERNAME` / `ADMIN_PASSWORD` через backend API. Basic Auth хранится
только в памяти вкладки и сбрасывается при обновлении страницы.

## Сборка и деплой

**Фронтенд** — статический сайт:

```bash
cd frontend
NUXT_PUBLIC_API_BASE=https://api.example.com npm run generate
```

Результат в `frontend/.output/public` — заливается на любой статик-хостинг (CDN, S3,
GitHub Pages и т. п.). Базовый URL API фиксируется на этапе генерации, поэтому
`NUXT_PUBLIC_API_BASE` нужно задать **перед** `npm run generate`.

В PowerShell та же сборка запускается так:

```powershell
cd frontend
$env:NUXT_PUBLIC_API_BASE = "https://api.example.com"
npm run generate
```

**Бэкенд** — бинарник:

```bash
cd backend
cargo build --release
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/piloproject
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=change-me
export ALLOWED_ORIGINS=https://pilorama-razbegaevo.clients.site
./target/release/backend
```

Готовый бинарник `backend/target/release/backend` запускается как сервис — например,
под systemd или в Docker-контейнере.

## Разработка

Сводка по hardening и проверкам безопасности: `docs/security.md`.

Перед коммитом:

```bash
cd backend
cargo fmt          # форматирование бэкенда
cargo clippy       # линтер бэкенда

cd ../frontend
npm run typecheck  # проверка типов фронтенда
```

Стиль кода и язык комментариев описаны в [docs/code-style.md](docs/code-style.md)
(документирующие комментарии — на русском).

## Структура

```
piloproject/
├── frontend/                 # приложение Nuxt 3 (статический сайт)
│   ├── nuxt.config.ts        # SSG, SEO-модули, изображения, runtimeConfig.public.apiBase
│   ├── app.vue
│   ├── layouts/
│   │   └── default.vue       # общий каркас и основная навигация
│   ├── pages/
│   │   ├── contacts.vue      # контакты, публичный маршрут /kontakty
│   │   ├── admin.vue         # админка отзывов, публичный маршрут /admin, noindex
│   │   ├── delivery.vue      # доставка, публичный маршрут /dostavka
│   │   ├── index.vue         # главная
│   │   ├── lumber.vue        # пиломатериалы, публичный маршрут /pilomaterialy
│   │   ├── reviews.vue       # отзывы, публичный маршрут /otzyvy
│   │   └── system-status.vue # состояние системы: проверка связки через useHealth()
│   ├── modules/
│   │   └── static-sitemap.ts # пререндер sitemap.xml
│   ├── server/
│   │   └── plugins/
│   │       └── sitemap-sources.ts # источники URL для @nuxtjs/sitemap
│   ├── scripts/
│   │   ├── generate-static-images.mjs # WebP-варианты для статических Nuxt Image URL
│   │   └── prepare-static-images.mjs  # подготовка WebP-исходников перед generate
│   ├── utils/
│   │   └── seo-routes.ts     # единый список индексируемых маршрутов
│   ├── composables/
│   │   └── useApi.ts         # useApiBase(), useHealth(), CRUD отзывов
│   ├── package.json
│   └── tsconfig.json
├── backend/                  # API на Rust Axum
│   ├── schema.sql            # первая схема PostgreSQL для отзывов
│   ├── src/
│   │   ├── main.rs           # сервер 0.0.0.0:8080, CORS, GET /api/health
│   │   └── reviews.rs        # CRUD отзывов через SeaORM
│   └── Cargo.toml
├── docs/
│   ├── code-style.md         # правила комментариев и язык проекта
│   ├── deployment.md         # инструкция по развертке frontend и backend
│   └── yandex-seo.md         # требования к вёрстке и разметке под Яндекс
└── README.md
```

## Troubleshooting

- **«Backend unreachable» / API недоступен.** Бэкенд не запущен или указан неверный
  базовый URL. Проверить, что `cargo run` работает и отвечает на
  `http://localhost:8080/api/health`, а `NUXT_PUBLIC_API_BASE` указывает на него.
- **Backend не стартует из-за `DATABASE_URL`.** Нужно поднять PostgreSQL, создать БД,
  задать `DATABASE_URL` и применить `backend/schema.sql`.
- **Backend не стартует из-за админки.** Задайте `ADMIN_USERNAME` и `ADMIN_PASSWORD`;
  они нужны для `/admin` и защищенных операций модерации.
- **Порт 8080 или 3000 занят.** Другой процесс держит порт. Освободить его или сменить
  порт (для фронтенда — переменной окружения `PORT` у `npm run dev`).
- **`cargo` не найден.** Rust не установлен — поставить тулчейн через
  [rustup](https://rustup.rs) (edition 2021).

## Документация

- [Код-стайл](docs/code-style.md) — правила документирующих комментариев и язык проекта.
- [Backend API](docs/backend-api.md) — контракт API, SeaORM и схема отзывов.
- [Развертка](docs/deployment.md) — сборка, запуск backend-сервиса и публикация frontend.
- [SEO под Яндекс](docs/yandex-seo.md) — техническая база, факторы ранжирования, домены и хостинг.
- [План запуска](docs/launch-plan.md) — пошаговый вывод сайта в продакшен и в поиск.
- [Передача бизнесу](docs/handover.md) — реестр активов и процедура передачи владельцу.
