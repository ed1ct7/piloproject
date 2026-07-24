# piloproject

Монорепозиторий: фронтенд **Nuxt 3 (SSG)** + бэкенд **Rust (Axum)**.

Демо-связка: статически сгенерированный сайт Nuxt обращается к API на Rust/Axum.
Сквозная проверка работоспособности выполняется через эндпоинт `/api/health`: главная
страница фронтенда запрашивает его и показывает состояние бэкенда — так проверяется, что
обе части собраны и связаны корректно.

## Стек

| Часть     | Технологии                                                   |
|-----------|--------------------------------------------------------------|
| Фронтенд  | Vue 3 + Vite + Nuxt 3 (SSG через `nuxt generate`), TypeScript |
| Бэкенд    | Rust, Axum, Tokio, Serde, tower-http (CORS)                  |

Nuxt 3 включает в себя Vue 3 и Vite; SSG — это `generate` Nuxt (полный статический пререндер).

## Требования

- **Node ≥ 20** — среда выполнения фронтенда.
- **pnpm** — менеджер пакетов фронтенда. Проще всего включить через `corepack enable`.
- **Rust (edition 2021)** — тулчейн для бэкенда, установка через [rustup](https://rustup.rs).

## Быстрый старт

Нужны два терминала: один для бэкенда, второй для фронтенда.

Терминал 1 — бэкенд:

```bash
cd backend
cargo run          # http://localhost:8080
```

Терминал 2 — фронтенд:

```bash
cd frontend
pnpm install
pnpm dev           # http://localhost:3000
```

Открыть `http://localhost:3000` — главная страница запросит `GET /api/health` у бэкенда и
покажет его состояние. Если бэкенд не запущен, страница сообщит о недоступности API.

## Переменные окружения

| Переменная             | Назначение                               | По умолчанию            |
|------------------------|------------------------------------------|-------------------------|
| `NUXT_PUBLIC_API_BASE` | Базовый URL backend, читается фронтендом | `http://localhost:8080` |

Значение попадает в runtime-config `public.apiBase` (см. `frontend/nuxt.config.ts`) и
используется в `composables/useApi.ts`. Можно задать через переменную окружения или файл
`.env` (он в `.gitignore` и в репозиторий не коммитится).

## Скрипты

Фронтенд (`cd frontend`, запуск как `pnpm <скрипт>`):

| Скрипт      | Действие                                             |
|-------------|------------------------------------------------------|
| `dev`       | Dev-сервер с HMR на `http://localhost:3000`          |
| `build`     | Сборка Nuxt (серверный/Node-режим)                   |
| `generate`  | Статическая сборка (SSG) → `frontend/.output/public` |
| `preview`   | Локальный просмотр собранного сайта                  |
| `typecheck` | Проверка типов (`vue-tsc`, strict)                   |

`postinstall` (`nuxt prepare`) выполняется автоматически после `pnpm install`.

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

CORS открыт для всех источников, методов и заголовков — чтобы статический сайт мог
обращаться к API с любого хоста.

## Сборка и деплой

**Фронтенд** — статический сайт:

```bash
cd frontend
NUXT_PUBLIC_API_BASE=https://api.example.com pnpm generate
```

Результат в `frontend/.output/public` — заливается на любой статик-хостинг (CDN, S3,
GitHub Pages и т. п.). Базовый URL API фиксируется на этапе генерации, поэтому
`NUXT_PUBLIC_API_BASE` нужно задать **перед** `pnpm generate`.

**Бэкенд** — бинарник:

```bash
cd backend
cargo build --release
./target/release/backend
```

Готовый бинарник `backend/target/release/backend` запускается как сервис — например,
под systemd или в Docker-контейнере.

## Разработка

Перед коммитом:

```bash
cargo fmt         # форматирование бэкенда
cargo clippy      # линтер бэкенда
pnpm typecheck    # проверка типов фронтенда
```

Стиль кода и язык комментариев описаны в [docs/code-style.md](docs/code-style.md)
(документирующие комментарии — на русском).

## Структура

```
piloproject/
├── frontend/                 # приложение Nuxt 3 (статический сайт)
│   ├── nuxt.config.ts        # SSG, nitro preset static, runtimeConfig.public.apiBase
│   ├── app.vue
│   ├── pages/
│   │   └── index.vue         # главная: проверка связки через useHealth()
│   ├── composables/
│   │   └── useApi.ts         # useApiBase(), useHealth() → GET /api/health
│   ├── package.json
│   └── tsconfig.json
├── backend/                  # API на Rust Axum
│   ├── src/
│   │   └── main.rs           # сервер 0.0.0.0:8080, CORS, GET /api/health
│   └── Cargo.toml
├── docs/
│   ├── code-style.md         # правила комментариев и язык проекта
│   └── yandex-seo.md         # требования к вёрстке и разметке под Яндекс
└── README.md
```

## Troubleshooting

- **«Backend unreachable» / API недоступен.** Бэкенд не запущен или указан неверный
  базовый URL. Проверить, что `cargo run` работает и отвечает на
  `http://localhost:8080/api/health`, а `NUXT_PUBLIC_API_BASE` указывает на него.
- **Порт 8080 или 3000 занят.** Другой процесс держит порт. Освободить его или сменить
  порт (для фронтенда — переменной окружения `PORT` у `pnpm dev`).
- **`cargo` не найден.** Rust не установлен — поставить тулчейн через
  [rustup](https://rustup.rs) (edition 2021).

## Документация

- [Код-стайл](docs/code-style.md) — правила документирующих комментариев и язык проекта.
- [SEO под Яндекс](docs/yandex-seo.md) — требования к вёрстке и разметке для поиска Яндекса.
