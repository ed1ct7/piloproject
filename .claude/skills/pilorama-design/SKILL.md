---
name: pilorama-design
description: Design system for Пилорама Разбегаево frontend. MUST load before any visual change in frontend/ — editing Vue pages, layouts, components, CSS, Tailwind classes, adding sections, restyling, animations. Defines palette, typography, shape, motion tokens and hard bans (дизайн, стиль, вёрстка, премиальный вид).
---

# Дизайн-система «Пилорама Разбегаево»

Характер: дорогая столярная мастерская, журнальная вёрстка. Крафт и материя,
не корпоративный SaaS. Спокойно, плотно, без визуального шума.

## Палитра — только токены из `app.vue :root`

| Токен | Значение | Роль |
|---|---|---|
| `--color-ink` | `#20231f` | основной текст, тёмные плашки |
| `--color-forest` | `#183126` | тёмно-зелёные поверхности, лого |
| `--color-forest-soft` | `#29483a` | вторичный зелёный |
| `--color-cream` | `#f3efe6` | фон страницы |
| `--color-paper` | `#faf7f0` | карточки, светлые плашки |
| `--color-sand` | `#ded4c3` | бордеры-разделители, тёплый нейтрал |
| `--color-line` | `rgb(32 35 31 / 22%)` | тонкие линии |
| `--color-copper` | `#934626` | ЕДИНСТВЕННЫЙ акцент: hover, цены, CTA |
| `--color-copper-dark` | `#7d3d24` | active/pressed медь |

Правила:
- Новые hex не вводить. Нужен оттенок — производная от ink/forest через opacity.
- Приглушённый текст: `--color-ink` + opacity, минимум `/70` (ниже мелкий текст
  проваливает контраст 4.5:1 на paper — проверено axe), не новые серые.
  В коде уже разбросаны `#596057 #5e625c #4f554d #545a52` — при касании таких мест
  заменять на токен/opacity, новых не добавлять.
- Медь в утилити-классах писать `text-(--color-copper)`, не голый hex.

## Типографика

- **Дисплей** (h1, h2, лого, крупные цифры): `Georgia, 'Times New Roman', serif`,
  `letter-spacing: -0.025em`. h1: `clamp(2.8rem, 4.1vw, 4.8rem)`. Заголовки крупные,
  не бояться размера.
- **Ярлык-надзаголовок** (eyebrow): `Segoe UI, Arial, sans-serif`, вес 740–780,
  uppercase, `tracking 0.04–0.15em`, размер 0.7–0.85rem. Открывает каждую секцию.
- **Текст**: системный sans по умолчанию, `line-height ≥ 1.5`.
- CSP: `font-src 'self' data:` — НИКАКИХ Google Fonts / CDN-шрифтов. Новый шрифт
  только self-hosted woff2 в `public/` + правка CSP в `nuxt.config.ts`.

## Форма и глубина

- Углы острые. `rounded-*` по умолчанию запрещён. Исключения: круг лого (50%),
  мелкие контролы 6px (уже есть в lumber). Никаких `rounded-2xl` карточек.
- Тень одна, большая, мягкая, вниз: `0 30px 70px rgb(32 35 31 / 18%)`.
  Не сочетать бордер+тень на одном элементе. Мелкие "материальные" тени не использовать.
- Разделение поверхностей: смена фона (cream ↔ paper ↔ forest) или линия
  `--color-line` / `--color-sand`, не тени.

## Motion — токены из `:root`

| Токен | Значение | Применение |
|---|---|---|
| `--motion-duration-press` | 140ms | нажатия (scale 0.98) |
| `--motion-duration-ui` | 180ms | hover, мелкий UI |
| `--motion-duration-page` | 220ms | переходы страниц |
| `--motion-duration-reveal` | 280ms | появление секций |
| `--motion-ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | основной easing |
| `--motion-ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | симметричные движения |

- Reveal-анимации секций и parallax (`data-parallax`) уже глобальные в `app.vue` —
  новые секции внутри `main > section` получают их автоматом, свои keyframes не писать.
- Длительности/easing только из токенов. Ничего дольше 300ms.
- `prefers-reduced-motion` глобально гасит motion в `app.vue`; собственные новые
  анимации обязаны иметь reduce-ветку.

## Запреты (анти-AI-шаблон)

- Фиолетовые/синие градиенты, glassmorphism, blur-подложки.
- Emoji вместо иконок; стоковые "тех" иконки.
- Дефолтные Tailwind-цвета (blue-500, indigo, slate...).
- Центрированные hero "заголовок+подзаголовок+две кнопки" — вёрстка асимметричная, журнальная.
- Одинаковые карточки 3-в-ряд с иконкой сверху.

## Проверка после визуальной правки

1. Dev-сервер отдаёт 426 — проверять через `npm run build` (generate) и статику,
   либо browser pane если поднят корректно.
2. Смотреть desktop 1280 + mobile 375, тёмная тема не поддерживается (сайт светлый).
3. `npm run test:smoke` гоняет Playwright + axe — доступность не ломать
   (focus-visible стили глобальные, контраст меди на креме уже на грани — текст медью
   мельче 1rem не делать).
