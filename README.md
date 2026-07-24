# piloproject

Монорепозиторий: фронтенд **Nuxt 3 (SSG)** + бэкенд **Rust (Axum)**.

## Стек

| Часть     | Технологии                                                 |
|-----------|------------------------------------------------------------|
| Фронтенд  | Vue 3 + Vite + Nuxt 3 (SSG через `nuxt generate`), TypeScript |
| Бэкенд    | Rust, Axum, Tokio, Serde, tower-http (CORS)                |

Nuxt 3 включает в себя Vue 3 и Vite; SSG — это `generate` Nuxt (полный статический пререндер).

## Структура

```
frontend/   приложение Nuxt 3 (статический сайт)
backend/    API на Rust Axum
docs/        документация проекта
```

## Требования

- Node ≥ 20 и pnpm
- Тулчейн Rust (установка через https://rustup.rs) — пока не установлен на этой машине

## Фронтенд

```bash
cd frontend
pnpm install
pnpm dev          # dev-сервер, http://localhost:3000
pnpm generate     # статическая сборка -> frontend/.output/public
pnpm preview      # просмотр сгенерированного статического сайта
```

## Бэкенд

```bash
cd backend
cargo run         # http://localhost:8080, GET /api/health
```

Фронтенд читает базовый URL API из `NUXT_PUBLIC_API_BASE` (по умолчанию `http://localhost:8080`).
Главная страница запрашивает `/api/health`, чтобы проверить связку целиком.

## Документация

- [Код-стайл](docs/code-style.md) — правила документирующих комментариев и язык проекта.
