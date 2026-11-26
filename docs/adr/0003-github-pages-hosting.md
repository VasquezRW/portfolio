# ADR 0003 — GitHub Pages hosting with GitHub Actions

- **Status**: Accepted
- **Date**: 2026-11-26

## Context

The site is static and the repository lives on GitHub. Hosting must be free and deploy automatically.

## Decision

Deploy to **GitHub Pages** using the official Actions flow (`actions/upload-pages-artifact` + `actions/deploy-pages`).

## Rationale

- Free, HTTPS included, no external account and **no secrets** (uses the built-in `GITHUB_TOKEN`).
- Deployment history and environments visible in the repository.

## Alternatives

| Host             | Pros                                    | Cons                                                      |
| ---------------- | --------------------------------------- | --------------------------------------------------------- |
| Cloudflare Pages | Per-PR preview URLs, generous free tier | Extra account, API token secret for Actions-based deploys |
| Netlify          | Per-PR previews, easy forms             | Build-minute limits on free tier                          |
| Vercel           | Per-PR previews                         | Hobby plan is non-commercial only                         |

## Custom domain

Decided: `wilmervasquez.page`, claimed through the **GitHub Student Developer Pack** (free for one year) and registered at name.com, pointed at GitHub Pages with apex `A`/`AAAA` records and a `www` CNAME. The Student Pack lives on the institutional GitHub account, but the domain belongs to the registrar account, so it serves Pages for the personal `VasquezRW` account. Setup steps and `gh` commands are in [deployment.md](../deployment.md#5-dns-at-namecom).
