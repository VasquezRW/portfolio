# ADR 0001 — Astro as static site framework

- **Status**: Accepted
- **Date**: 2026-11-26

## Context

The portfolio is content-heavy, has almost no interactivity, must be fully static, bilingual and fast.

## Decision

Use **Astro 5** with TypeScript strict mode and static output.

## Rationale

- Ships zero JS by default; HTML is generated at build time → excellent Lighthouse scores.
- Content Collections with Zod give typed, validated content; adding a project is adding a file.
- Built-in i18n routing and `hreflang` support.
- Can host React/Vue/Svelte islands later if a richer demo is needed.

## Alternatives considered

- **Next.js static export**: React runtime overhead for a non-interactive site; i18n not supported in static export.
- **Plain HTML + Vite**: no content model or i18n routing; more hand-written plumbing.
- **Hugo / Eleventy**: fine, but weaker TypeScript and component story.
