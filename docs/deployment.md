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
3. Разместить `deploy/nginx-piloproject.conf` как `/root/nginx-piloproject.conf` и запустить `deploy/install-release.sh`. При первом запуске скрипт временно включает HTTP, получает сертификат Certbot и затем активирует полный TLS-конфиг. Email Certbot можно переопределить через `CERTBOT_EMAIL`.
4. Выполнить деплой командой из `docs/deploye-command.md`.
5. Запустить `deploy/verify-vps.sh`.

Nginx отдаёт только статические файлы, отключает access log и записывает лишь критические ошибки. Скрипты не удаляют ранее созданные production-базы или сервисы.

## Вывод старого backend из эксплуатации

После резервной копии и успешного статического деплоя администратор может вручную остановить старый сервис:

```bash
systemctl disable --now piloproject-backend
```

Удаление базы PostgreSQL, пакетов и резервных копий выполняется отдельно только после подтверждения владельца: это необратимая операция и не входит в автоматический деплой.

## Проверка

```bash
curl -I https://pilorama-razbegaevo.ru/
curl https://pilorama-razbegaevo.ru/robots.txt
curl https://pilorama-razbegaevo.ru/sitemap.xml
```
