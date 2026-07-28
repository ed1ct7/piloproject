# Backend API

Backend написан на Rust/Axum. Для работы с PostgreSQL используется **SeaORM** как основной
ORM проекта. Ручной SQL допускается для схемы и миграций, но CRUD-логика backend должна
работать через entity/ActiveModel/Entity API SeaORM.

## База данных

Backend читает подключение из переменной окружения `DATABASE_URL`.

Пример:

```bash
export DATABASE_URL=postgres://postgres:postgres@localhost:5432/piloproject
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
`422 Unprocessable Entity`.

### Удалить отзыв

`DELETE /api/reviews/:id`

Успешный ответ: `204 No Content`. Если отзыв не найден — `404 Not Found`.
