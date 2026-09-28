#!/usr/bin/env bash
set -Eeuo pipefail

# Короткая команда деплоя последнего commit из main (канон — docs/deploy-command.md).
# Ставится на сервер как /usr/local/bin/pilo-deploy, запускается от root:
#   ssh root@<сервер> pilo-deploy

repo="ed1ct7/piloproject"
branch="main"

commit="$(curl -fsSL "https://api.github.com/repos/$repo/commits/$branch" | python3 -c 'import json,sys; print(json.load(sys.stdin)["sha"])')"
echo "Деплой $repo@$commit"
curl -fsSL "https://raw.githubusercontent.com/$repo/$commit/scripts/deploy-production.sh" | bash -s -- "$commit"
