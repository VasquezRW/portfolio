# syntax=docker/dockerfile:1
# Toolchain for the portfolio. Nothing but Docker is needed on the host.
# Stages:
#   dev   Node + pnpm; source is bind-mounted by compose (dev server, lint, check, unit tests)
#   e2e   Playwright image with browsers preinstalled (e2e + accessibility tests)
#   build static build from a clean copy of the repo
#   site  nginx serving the build, close to how GitHub Pages serves it

ARG NODE_VERSION=22
# Must match the exact @playwright/test version in package.json.
ARG PLAYWRIGHT_VERSION=1.55.0

FROM node:${NODE_VERSION}-bookworm-slim AS dev
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    ASTRO_TELEMETRY_DISABLED=1 \
    npm_config_store_dir=/app/node_modules/.pnpm-store
RUN corepack enable
WORKDIR /app
EXPOSE 4321
CMD ["sh", "-c", "pnpm install && pnpm dev --host 0.0.0.0"]

FROM mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble AS e2e
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    COREPACK_ENABLE_DOWNLOAD_PROMPT=0 \
    ASTRO_TELEMETRY_DISABLED=1 \
    npm_config_store_dir=/app/node_modules/.pnpm-store
RUN corepack enable
WORKDIR /app
CMD ["sh", "-c", "pnpm install --frozen-lockfile && pnpm test:e2e"]

FROM dev AS build
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:1.27-alpine AS site
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
