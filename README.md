# Portfolio

Personal portfolio of Wilmer Vasquez, QA Automation Engineer: profile, work experience and achievements, skills, personal projects and contact. Static site, English by default with a full Spanish translation.

**Stack**: Astro 5 · TypeScript · Tailwind CSS v4 · Vitest · Playwright · Docker · GitHub Actions · GitHub Pages

> Live at <https://wilmervasquez.page> once the repository and DNS setup in [docs/deployment.md](docs/deployment.md) is done.

## Getting started

The only requirement is **Docker** (Docker Desktop on Windows/macOS). Node, pnpm, dependencies and browsers run in containers.

```bash
docker compose run --rm tools pnpm install   # first time
docker compose up dev                        # http://localhost:4321  (EN at /, ES at /es/)
```

## Quality

```bash
docker compose run --rm tools pnpm lint      # ESLint + Prettier check
docker compose run --rm tools pnpm check     # astro check (types + content schemas)
docker compose run --rm tools pnpm test      # Vitest unit tests
docker compose run --rm e2e                  # build + Playwright e2e and accessibility
docker compose up --build site               # production build on http://localhost:8080
```

All commands and notes: [docs/development.md](docs/development.md).

## Adding content

Everything visible on the site comes from `src/content/` and `src/i18n/`. To add a project, create `src/content/projects/en/<slug>.md` and `src/content/projects/es/<slug>.md` plus a cover image. Full steps in [docs/contributing.md](docs/contributing.md).

## Documentation

- [Requirements](docs/requirements.md)
- [Design base](docs/design.md)
- [Architecture](docs/architecture.md)
- [Local development with Docker](docs/development.md)
- [Contributing workflow](docs/contributing.md)
- [Deployment and repository setup](docs/deployment.md)
- [Architecture decision records](docs/adr/)
