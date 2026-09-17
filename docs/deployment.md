# Развёртывание

## Архитектура

Production — статический Nuxt-сайт за Nginx. Backend, PostgreSQL и прокси `/api/` не используются.

## Сборка

```bash
npm --prefix frontend ci
npm run check
npm --prefix frontend run generate
```

Готовые файлы находятся в `frontend/.output/public`. Переменные окружения API не нужны.

## Первичная установка VPS

1. Запустить `deploy/bootstrap-vps.sh` от root.
2. Направить DNS домена и `www` на VPS.
3. Разместить `deploy/nginx-piloproject.conf` как `/root/nginx-piloproject.conf` и `deploy/nginx-security-headers.conf` как `/root/nginx-security-headers.conf`, затем запустить `deploy/install-release.sh`. Скрипт сам устанавливает security-заголовки в `/etc/nginx/snippets/piloproject-security-headers.conf` раньше основного конфига (иначе `nginx -t` упадёт на отсутствующем `include`), а при первом запуске ещё и временно включает HTTP, получает сертификат Certbot и затем активирует полный TLS-конфиг. Email Certbot можно переопределить через `CERTBOT_EMAIL`.
4. Перед применением `deploy/nginx-piloproject.conf` проверить версию сервера — `nginx -v`. Директива `http2 on;` работает только на nginx ≥ 1.25.1; на более старой версии (например, штатный пакет Ubuntu 24.04 — nginx/1.24.0) конфиг использует форму `listen 443 ssl http2;` — она уже в файле по умолчанию. При обновлении nginx до 1.25.1+ форму в `listen` нужно заменить на `listen 443 ssl;` + отдельную строку `http2 on;` (комментарий рядом в конфиге).
5. Выполнить деплой командой из [deploy-command.md](deploy-command.md).
6. Запустить `deploy/verify-vps.sh`.

Nginx отдаёт только статические файлы, отключает access log и записывает лишь критические ошибки. Скрипты не удаляют ранее созданные production-базы или сервисы.

## Обновление конфига Nginx на уже установленном сервере

Файлы `deploy/nginx-piloproject.conf` и `deploy/nginx-security-headers.conf` руками копируются в `/root/` и устанавливаются повторным запуском `deploy/install-release.sh` (он же обновит include-файл и основной конфиг). Перед `systemctl reload nginx` обязателен `nginx -t` — он уже встроен в `install-release.sh`, но при ручной правке конфига на сервере проверять отдельно перед каждым reload.

Перед установкой обязательно сделать копию текущего конфига, иначе откатывать будет нечего:

```bash
cp -a /etc/nginx/sites-available/piloproject "/root/nginx-piloproject.conf.backup-$(date +%Y%m%d-%H%M%S)"
```

До 17.09.2026 `install-release.sh` безусловно записывал в корень сайта заглушку «Сайт устанавливается» и на уже работающем сайте затирал ею главную страницу. Сейчас заглушка пишется только в ветке первичной установки, когда сертификата ещё нет, поэтому скрипт безопасно запускать на живом сервере.

Типы MIME для отдельных файлов (`.vtt`, `.xsl`, WebP из `/_ipx/`) задаются в конфиге через `types { }` + `default_type` внутри нужного `location`, а не блоком `types` на уровне `server`. Блок `types` заменяет унаследованную карту типов целиком, а подключить в него `include /etc/nginx/mime.types;` нельзя: этот файл сам обёрнут в `types { … }`, и `nginx -t` падает с `unexpected "{" in /etc/nginx/mime.types:2`.

Если `nginx -t` упал после правки:

1. Не выполнять `systemctl reload nginx` — старый конфиг на сервере при этом продолжает работать без изменений.
2. Восстановить предыдущую версию `/etc/nginx/sites-available/piloproject` (и, если менялся, `/etc/nginx/snippets/piloproject-security-headers.conf`) из бэкапа.
3. Повторить `nginx -t` и убедиться, что он проходит на восстановленном конфиге.
4. Только после успешного `nginx -t` выполнять `systemctl reload nginx`.
5. Разбирать причину ошибки в новом конфиге отдельно, без спешки, и повторить установку после исправления.

## Вывод старого backend из эксплуатации

После резервной копии и успешного статического деплоя администратор может вручную остановить старый сервис:

```bash
systemctl disable --now piloproject-backend
```

Удаление базы PostgreSQL, пакетов и резервных копий выполняется отдельно только после подтверждения владельца: это необратимая операция и не входит в автоматический деплой.

## Проверка

Полная проверка — `deploy/verify-vps.sh` (шаг 5). Быстрая ручная:

```bash
curl -I https://pilorama-razbegaevo.ru/
```
