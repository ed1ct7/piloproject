# AGENTS.md

## Project

Piloproject consists of:

- `frontend/` — Nuxt 3, Vue, TypeScript, and static generation.
- `docs/` — architecture, security, deployment, and code requirements.
- `deploy/` and `scripts/` — operational and development scripts.

Before making changes, read `README.md` and the documents in `docs/` that are relevant to the task.

## Working rules

- Make the smallest change required by the task.
- Do not change dependencies or `package-lock.json` unless the task requires it.
- Do not edit generated directories such as `node_modules`, `.nuxt`, `.output`, or `target`.
- Do not perform a production deployment without an explicit request.
- Never add secrets, passwords, or real production environment values to the repository.
- Update `docs/backend-api.md` if an API is introduced or changed.
- Follow `docs/code-style.md`.
- Preserve Russian-language user-facing content and documentation unless the task asks for a translation.

## Verification

Run the baseline check from the repository root:

```text
npm run check
```

For changes to static generation, routes, or SEO, run:

```text
npm --prefix frontend run generate
```

Generation is self-contained and must not require a backend or API environment variable.

## Subagents

Use subagents when a task contains at least two independent workstreams. Good candidates include:

- parallel frontend and operations investigation;
- a separate security review;
- test-coverage analysis;
- reviewing a large branch against multiple independent criteria.

Coordination rules:

- The primary agent owns the plan, integration, and final verification.
- Exploration and review agents do not edit files.
- Only one agent may edit a given group of files at a time.
- Do not delegate simple or sequential tasks.
- After combining results, the primary agent reviews the final diff and runs the relevant checks.

## Definition of done

- The requested behavior is implemented.
- Relevant tests and checks pass.
- Documentation is updated when contracts or operations change.
- The diff contains no accidental or unrelated changes.
