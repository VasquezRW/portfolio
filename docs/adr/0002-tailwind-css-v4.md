# ADR 0002 — Tailwind CSS v4 for styling

- **Status**: Accepted
- **Date**: 2026-11-26

## Context

The owner wants to learn a front-end technology they have not used before. The design must be minimal and consistent.

## Decision

Use **Tailwind CSS v4** through the `@tailwindcss/vite` plugin, with design tokens declared in CSS via `@theme`.

## Rationale

- Utility-first styling keeps styles next to markup; no dead CSS in production.
- v4 CSS-first configuration: tokens are plain CSS variables, usable outside Tailwind too.
- Semantic token names (`surface`, `text`, `muted`, `accent`) make theme changes a one-file edit.

## Rules

- Never use raw palette utilities (`bg-zinc-900`) in components; use semantic tokens.
- Extract a component when a class list repeats in 3+ places, not a custom `@apply` class.
- `prettier-plugin-tailwindcss` sorts classes automatically.
