# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Static bilingual portfolio (EN default at `/`, ES at `/es/`) built with Astro 5, TypeScript strict and Tailwind CSS v4, deployed to GitHub Pages via GitHub Actions. Requirements, architecture and decisions live in `docs/` — read `docs/architecture.md` before structural changes and add an ADR in `docs/adr/` when a decision changes.

Design tokens and section specs: `docs/design.md`. Hosting: GitHub Pages on the `VasquezRW` account with a custom domain from the GitHub Student Pack (claimed on a separate institutional account); repo setup is done manually with `gh` commands in `docs/deployment.md`. Domain: `wilmervasquez.page` (name.com); it is set in `SITE` (`astro.config.mjs`), `public/CNAME` and `public/robots.txt`, which must change together.

## Commands

Everything runs in Docker; Node/pnpm are not installed on the host. `node_modules` lives in the `portfolio_node_modules` volume (see `docs/development.md`).

```bash
docker compose run --rm tools pnpm install          # install / after dependency changes
docker compose up dev                               # dev server, http://localhost:4321
docker compose run --rm tools pnpm lint             # ESLint + Prettier
docker compose run --rm tools pnpm check            # astro check (types + content schemas)
docker compose run --rm tools pnpm test             # Vitest
docker compose run --rm tools pnpm vitest run tests/unit/<file>.test.ts   # single unit test
docker compose run --rm tools pnpm build            # static build to dist/
docker compose run --rm e2e                         # build + Playwright e2e/axe
docker compose run --rm e2e pnpm exec playwright test tests/e2e/<file>.spec.ts -g "<name>"
docker compose up --build site                      # prod build via nginx, http://localhost:8080
```

`@playwright/test` is pinned exactly in `package.json`; `PLAYWRIGHT_VERSION` in `Dockerfile` must match it. CI (`.github/workflows/ci.yml`) runs the same pnpm scripts natively, not in Docker, on `ubuntu-24.04` (pinned: `ubuntu-latest` can move to an OS the pinned Playwright does not support).

## Architecture essentials

- All displayed data comes from content collections in `src/content/` (schemas in `src/content.config.ts`) and UI strings in `src/i18n/{en,es}.json`. Components never hardcode copy.
- Every content entry and every i18n key must exist in **both** locales; entry ids are `<locale>/<slug>` and a parity unit test enforces matching slugs.
- Adding a project = two Markdown files (`projects/en/<slug>.md`, `projects/es/<slug>.md`) + cover in `src/assets/projects/<slug>/`. No component edits.
- Styling uses semantic tokens from `@theme` in `src/styles/global.css` (`bg-surface`, `text-muted`, `accent`…). Do not use raw palette utilities in components.
- Dark mode is driven by `data-theme` on `<html>`, set by an inline script in `BaseLayout.astro` before paint.
- Keep client JS minimal (theme toggle, mobile nav only).
- Never add sensitive personal data (phone, age, address, IDs, references' contacts, the bank's name) to content; a unit test and an e2e test check for the phone. Mark self-taught skills with `selfTaught: true`.
- Career graph geometry lives in `src/lib/career-graph.ts` (pure, unit-tested); `CareerGraph.astro` renders one static SVG per breakpoint.
- Commits: Conventional Commits, without Claude co-author or attribution lines.

## Workflow

Branches `feat/*`, `fix/*`, `content/*`, `docs/*` → PR → `main` (protected, requires `CI`). Conventional Commits. Deployment and manual GitHub setup: `docs/deployment.md`.
