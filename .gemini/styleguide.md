# Immergutrocken Code Review Style Guide

This project is a pnpm monorepo with two apps: a Next.js website (`apps/website`) and a Sanity Studio CMS (`apps/cms`).

## General

- **Package manager**: `pnpm` only. Flag any use of `npm install`, `yarn add`, or `npm run` — they must be replaced with `pnpm`.
- **TypeScript**: Strict mode is enabled everywhere. Flag any use of `any` that is not accompanied by a comment explaining why it is unavoidable. Prefer `unknown` for truly dynamic values.
- **No `.env` files**: Secrets are managed via Doppler and injected into `.env.local` at runtime. Flag any committed `.env` files or hardcoded secrets.
- **No unnecessary comments**: Do not flag missing comments for self-explanatory code. Only flag when a non-obvious constraint, workaround, or subtle invariant is undocumented.

## `apps/website` — Next.js 15 SSG

- Uses the **Pages Router** (`pages/` directory), not the App Router (`app/` directory). Flag any App Router patterns: `app/` directory usage, React Server Components, `"use client"` directives used outside of a Pages Router context.
- Static Site Generation (SSG) via `getStaticProps` / `getStaticPaths`. Flag `getServerSideProps` unless there is a clear reason.
- **i18n**: Handled by `next-intl`. Locales are `de` (default) and `en`. Flag hardcoded German or English strings that should go through the translation system.
- **Styling**: Tailwind CSS. Flag inline styles or new CSS-in-JS dependencies.

## `apps/cms` — Sanity Studio 4

- Uses Sanity Studio 4 (`sanity` package v4.x). Flag any deprecated Sanity v2 or v3 APIs (e.g. old `@sanity/base` imports, old desk structure API).
- Schema definitions should use `defineField`, `defineType`, and `defineArrayMember` from `sanity`.
