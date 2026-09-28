# Команда production-деплоя

После отправки проверенного commit в `main` запустить на сервере от root:

```bash
set -Eeuo pipefail
REPO="ed1ct7/piloproject"
BRANCH="main"
COMMIT="$(curl -fsSL "https://api.github.com/repos/$REPO/commits/$BRANCH" | python3 -c 'import json,sys; print(json.load(sys.stdin)["sha"])')"
curl -fsSL "https://raw.githubusercontent.com/$REPO/$COMMIT/scripts/deploy-production.sh" | bash -s -- "$COMMIT"
```

То же одной командой с любого компьютера, чей ключ есть в `/root/.ssh/authorized_keys`:

```bash
ssh root@<сервер> pilo-deploy
```

`pilo-deploy` — копия `deploy/pilo-deploy.sh` в `/usr/local/bin/`. Установка или обновление с машины с доступом:

```bash
ssh root@<сервер> 'install -m 755 /dev/stdin /usr/local/bin/pilo-deploy' < deploy/pilo-deploy.sh
```

Скрипт скачивает зафиксированный commit, генерирует статический сайт, проверяет отсутствие удалённых API/iframe, атомарно переключает каталог и проверяет публичные маршруты. Он не удаляет прежний backend или PostgreSQL.

Файлы `/_nuxt/` прошлых сборок скрипт переносит в новый релиз и удаляет через 30 дней после того, как их перестала использовать сборка (список — `/var/www/.piloproject-carried-assets`). Так HTML, скачанный до деплоя браузером или роботом Яндекса, не ссылается на удалённые чанки; причина — `docs/seo-plan-2026-09.md`, §11.

Проверить развернутый commit: `cat /var/www/.piloproject-deployed-commit`.
