# Backend API

Backend написан на Rust/Axum. Для работы с PostgreSQL используется **SeaORM** как основной
ORM проекта. Ручной SQL допускается для схемы и миграций, но CRUD-логика backend должна
работать через entity/ActiveModel/Entity API SeaORM.

## База данных

Backend читает подключение из переменной окружения `DATABASE_URL`.
Админские операции читают логин и пароль из `ADMIN_USERNAME` и `ADMIN_PASSWORD`.
Браузерные CORS-запросы разрешаются только для origins из `ALLOWED_ORIGINS`.

Пример:

```bash
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/piloproject
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=change-me
export ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

Первая схема лежит в `backend/schema.sql`:

```bash
psql "$DATABASE_URL" -f backend/schema.sql
```

Таблица отзывов:

```sql
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    author_name TEXT NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Отзывы

Все ответы API используют `camelCase`.
Backend ограничивает JSON-тело запроса 16 КБ, `authorName` до 80 символов, `text` до 1000 символов,
а `rating` принимает только значения от 1 до 5.

Публичные операции:

- `POST /api/reviews` — создать отзыв;
- `GET /api/reviews` — получить список;
- `GET /api/reviews/:id` — получить один отзыв.

Админские операции требуют заголовок `Authorization: Basic ...`, построенный из
`ADMIN_USERNAME:ADMIN_PASSWORD`:

- `GET /api/admin/session` — проверить логин администратора;
- `PUT /api/reviews/:id` — изменить отзыв;
- `DELETE /api/reviews/:id` — удалить отзыв.

Если логин или пароль неверные, backend возвращает `401 Unauthorized` и JSON:

```json
{
  "error": "unauthorized",
  "message": "Неверный логин или пароль администратора"
}
```

### Проверить админский доступ

`GET /api/admin/session`

Успешный ответ: `200 OK`.

```json
{
  "authenticated": true
}
```

### Создать отзыв

`POST /api/reviews`

```json
{
  "authorName": "Анна",
  "text": "Хороший брус и быстрая доставка",
  "rating": 5
}
```

Успешный ответ: `201 Created`.
Пустые или слишком длинные `authorName`/`text`, а также некорректный `rating` возвращают
`422 Unprocessable Entity`.

### Получить список отзывов

`GET /api/reviews`

Успешный ответ: `200 OK`.

### Получить один отзыв

`GET /api/reviews/:id`

Успешный ответ: `200 OK`. Если отзыв не найден — `404 Not Found`.

### Изменить отзыв

`PUT /api/reviews/:id`

Можно передать одно или несколько полей:

```json
{
  "text": "Обновленный отзыв",
  "rating": 4
}
```

Успешный ответ: `200 OK`. Пустой объект и некорректный рейтинг возвращают
`422 Unprocessable Entity`. Без корректного Basic Auth возвращается `401 Unauthorized`.

### Удалить отзыв

`DELETE /api/reviews/:id`

Успешный ответ: `204 No Content`. Если отзыв не найден — `404 Not Found`.
Без корректного Basic Auth возвращается `401 Unauthorized`.

## Безопасность

- CORS не использует wildcard и настраивается через `ALLOWED_ORIGINS`.
- Backend добавляет `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy` и базовый `Content-Security-Policy` для API-ответов.
- Внутренние ошибки PostgreSQL не возвращаются клиенту в открытом виде.
- Basic Auth для админки не сохраняется в `localStorage` или `sessionStorage` frontend-страницы.
