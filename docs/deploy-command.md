# Команда production-деплоя

После отправки проверенного commit в `main` запустить на сервере от root:

```bash
set -Eeuo pipefail
REPO="ed1ct7/piloproject"
BRANCH="main"
COMMIT="$(curl -fsSL "https://api.github.com/repos/$REPO/commits/$BRANCH" | python3 -c 'import json,sys; print(json.load(sys.stdin)["sha"])')"
curl -fsSL "https://raw.githubusercontent.com/$REPO/$COMMIT/scripts/deploy-production.sh" | bash -s -- "$COMMIT"
```

Скрипт скачивает зафиксированный commit, генерирует статический сайт, проверяет отсутствие удалённых API/iframe, атомарно переключает каталог и проверяет публичные маршруты. Он не удаляет прежний backend или PostgreSQL.

Проверить развернутый commit: `cat /var/www/.piloproject-deployed-commit`.
