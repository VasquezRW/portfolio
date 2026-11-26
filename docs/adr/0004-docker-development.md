# ADR 0004: Docker for local development

- **Status**: Accepted
- **Date**: 2026-11-26

## Context

The owner wants a toolchain that does not install Node.js, pnpm, dependencies or browsers on the host and behaves the same on any OS.

## Decision

Use one multi-stage `Dockerfile` (`dev`, `e2e`, `build`, `site`) and `compose.yaml` services (`dev`, `tools`, `e2e`, `site`). Source is bind-mounted; `node_modules` lives in a named volume. E2E tests run in the official Playwright image, pinned to the same version as `@playwright/test`.

CI keeps running natively on GitHub's Ubuntu runners with the same pnpm scripts: it is faster with the pnpm cache, and the runner is already a disposable, reproducible environment.

## Consequences

- Only Docker is needed to develop, test and preview the site.
- Editors do not see `node_modules` on the host; use VS Code Dev Containers for full IntelliSense.
- The Playwright version is declared twice (`package.json`, `Dockerfile`) and must be bumped together.
