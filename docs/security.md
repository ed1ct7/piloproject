# Безопасность

## Что включено

- Backend ограничивает CORS через `ALLOWED_ORIGINS`. Wildcard `*` не используется.
- Backend добавляет защитные заголовки: `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`.
- Frontend задает security headers через `routeRules` Nuxt. При отдаче чистой статики убедитесь,
  что выбранный хостинг или веб-сервер действительно применяет эти заголовки.
- JSON-тело API ограничено 16 КБ.
- Поля отзывов ограничены на backend: `authorName` до 80 символов, `text` до 1000 символов,
  `rating` от 1 до 5.
- Внутренние ошибки PostgreSQL не возвращаются клиенту в открытом виде.
- Админские операции требуют `Authorization: Basic ...`.
- Basic Auth для админки хранится только в памяти вкладки и сбрасывается при перезагрузке страницы.
- `/admin` закрыт от индексации и исключен из sitemap.

## Проверки

```bash
cd backend
cargo fmt --check
cargo clippy -- -D warnings
cargo test

cd ../frontend
npm audit --omit=dev
npm run typecheck
npm run generate
```

## Остаточный риск

`npm audit` без `--omit=dev` сейчас показывает high advisories в dev/build-цепочке
`nuxt -> nitropack -> archiver -> brace-expansion`. Production-аудит (`npm audit --omit=dev`)
чистый. Принудительный override `archiver@8` ломает текущий Nitro, а `npm audit fix --force`
ведет к major-переходу Nuxt. Обновляйте Nuxt/Nitro после появления совместимого фикса и обязательно
прогоняйте `npm run typecheck` и `npm run generate`.

## Production-чеклист

- Включить HTTPS.
- Задать длинный случайный `ADMIN_PASSWORD`.
- Задать `ALLOWED_ORIGINS` только с реальными frontend-доменами.
- Не публиковать backend напрямую в интернет, если API проксируется через веб-сервер.
- Проверить security headers командой `curl -I https://example.com`.
