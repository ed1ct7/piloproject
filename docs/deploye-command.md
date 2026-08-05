# Production deployment

Run as `root` and pass the exact commit that has already been pushed to GitHub:

```bash
curl -fsSL https://raw.githubusercontent.com/ed1ct7/piloproject/main/scripts/deploy-production.sh | bash -s -- COMMIT_SHA
```

Run `npm run check` locally before deployment. The script creates the static Nuxt build with
the production API base, validates the output, switches `/var/www/piloproject` atomically, checks the public
routes and services, and automatically restores the previous release if a post-switch check
fails. The successful release leaves its timestamped backup in `/var/www`.
