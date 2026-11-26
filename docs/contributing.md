# Contributing workflow

## Branches

- `main` is always deployable and protected: changes land only through pull requests with a green `CI` check.
- Work in short-lived branches: `feat/<topic>`, `fix/<topic>`, `content/<topic>`, `docs/<topic>`, `chore/<topic>`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `content:`, `docs:`, `test:`, `refactor:`, `chore:`, `ci:`.

## Adding content

### A new project

1. Create `src/content/projects/en/<slug>.md` and `src/content/projects/es/<slug>.md` (same slug). Copy `mobile-testing-demo.md` as a template.
2. Add the cover image to `src/assets/projects/<slug>/cover.png|jpg|webp` (≥ 1200 px wide; cards crop to 16:10 from the top left). Avoid screenshots that show local paths, IPs or personal data.
3. Fill the frontmatter defined in `src/content.config.ts`; write the detail page in the Markdown body.
4. `docker compose run --rm tools sh -c "pnpm test && pnpm build"`. The build fails on invalid frontmatter; the parity test fails if a locale is missing.

### A new position

Same pattern in `src/content/experience/{en,es}/<slug>.yaml`. Omit `end` for a current role; it then stays open in the career graph.

### A new UI string

Add the key to both `src/i18n/en.json` and `src/i18n/es.json`.

## Pull request checklist

- [ ] Both locales updated (content and UI strings).
- [ ] `pnpm lint`, `pnpm check`, `pnpm test` (via `docker compose run --rm tools …`) and `docker compose run --rm e2e` pass locally.
- [ ] New images have meaningful `alt` text.
- [ ] No sensitive personal data (phone, address, IDs).
- [ ] Docs/ADR updated if an architectural decision changed.
