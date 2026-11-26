# Local development with Docker

The only requirement on your machine is **Docker** (Docker Desktop on Windows/macOS, Docker Engine + Compose plugin on Linux). Node.js, pnpm, dependencies and Playwright browsers all live inside containers, so the setup is identical on every OS and nothing is installed globally.

`node_modules` lives in a Docker volume (`portfolio_node_modules`), not in the repository folder. Your editor will not see it; for IntelliSense in VS Code, open the folder with the _Dev Containers_ extension or install dependencies locally as an optional extra.

## Services

| Service | Image                                              | What it does                                                             |
| ------- | -------------------------------------------------- | ------------------------------------------------------------------------ |
| `dev`   | `node:22` + pnpm                                   | Installs dependencies and runs the dev server on <http://localhost:4321> |
| `tools` | same as `dev`                                      | One-off commands: lint, type check, unit tests, build, add packages      |
| `e2e`   | `mcr.microsoft.com/playwright` (browsers included) | Builds the site and runs Playwright e2e + accessibility tests            |
| `site`  | `nginx:alpine`                                     | Serves a clean production build on <http://localhost:8080>               |

## Commands

```bash
# First time (and after pulling dependency changes)
docker compose run --rm tools pnpm install

# Dev server with hot reload
docker compose up dev                     # Ctrl+C to stop; add -d to run in background

# Quality checks (same as CI)
docker compose run --rm tools pnpm lint
docker compose run --rm tools pnpm check
docker compose run --rm tools pnpm test
docker compose run --rm tools pnpm vitest run tests/unit/i18n.test.ts   # single file
docker compose run --rm e2e                                             # build + all e2e
docker compose run --rm e2e pnpm exec playwright test -g "theme"        # single e2e test (after a build)

# Format code
docker compose run --rm tools pnpm format

# Add or update a dependency (updates package.json and pnpm-lock.yaml on the host)
docker compose run --rm tools pnpm add <package>
docker compose run --rm tools pnpm add -D <package>

# Production build served like GitHub Pages
docker compose up --build site

# Clean up containers and the dependency volume
docker compose down -v
```

## Notes

- **Playwright version**: `@playwright/test` is pinned to an exact version in `package.json`, and `PLAYWRIGHT_VERSION` in the `Dockerfile` must match it. Update both together (Dependabot only bumps `package.json`, and the e2e run fails with a clear version-mismatch error if they drift).
- **File watching**: `CHOKIDAR_USEPOLLING=true` is set in `compose.yaml` because file events do not cross Docker Desktop bind mounts on Windows/macOS.
- **Line endings**: on Windows keep `git config core.autocrlf input` (or rely on `.gitattributes`) so Prettier does not flag CRLF.
- **CI** runs natively on GitHub's Ubuntu runners (faster thanks to the pnpm cache) using the same commands; see [deployment.md](deployment.md).
