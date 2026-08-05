# Production-деплой последней версии

Перед деплоем отправьте изменения в ветку `main` на GitHub и локально запустите
`npm run check`. Затем выполните на production-сервере от `root`:

```bash
set -Eeuo pipefail

REPO="ed1ct7/piloproject"
BRANCH="main"

COMMIT="$(
  curl -fsSL "https://api.github.com/repos/$REPO/commits/$BRANCH" |
    python3 -c 'import json, sys; print(json.load(sys.stdin)["sha"])'
)"

if [[ ! "$COMMIT" =~ ^[0-9a-f]{40}$ ]]; then
  echo "Не удалось определить последний commit ветки $BRANCH" >&2
  exit 1
fi

printf 'Deploying latest commit: %s\n' "$COMMIT"

curl -fsSL "https://raw.githubusercontent.com/$REPO/$COMMIT/scripts/deploy-production.sh" |
  bash -s -- "$COMMIT"
```

Команда определяет последний commit ветки `main` в момент запуска и использует один
точный SHA как для deployment-скрипта, так и для исходников сайта. Это исключает
рассинхронизацию, если ветка изменится во время деплоя.

Скрипт собирает статический Nuxt frontend с production API, проверяет результат,
атомарно заменяет `/var/www/piloproject`, проверяет публичные маршруты и сервисы и
автоматически восстанавливает предыдущий релиз при ошибке после переключения. Успешный
деплой оставляет резервную копию с временной меткой в `/var/www`.

Проверить SHA развернутой версии:

```bash
cat /var/www/.piloproject-deployed-commit
```

Скрипт не обновляет backend, схему PostgreSQL, Nginx или systemd. При изменениях этих
компонентов используйте полную процедуру из [deployment.md](deployment.md).
