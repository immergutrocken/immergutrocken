# Immergutrocken Monorepo

## Package Manager
- Always use `pnpm` — never npm or yarn

## Commands
- Install: `pnpm install`
- Dev: `turbo run dev`
- Build: `turbo run build` — run after every change to verify compilation
- Test: `turbo run test`
- Lint: `turbo run lint`

## Structure
- `apps/website` — Next.js 15 SSG, **Pages Router** (not App Router), TypeScript strict, Tailwind
- `apps/cms` — Sanity Studio 4, headless CMS
- Website app structure uses top-level folders such as `components`, `lib`, and `pages` (no documented `src/` alias)

## Conventions
- TypeScript strict mode everywhere — avoid `any` when possible, and document exception cases
- i18n via `next-intl`; locales `de` (default) and `en`
- No `.env` files committed — secrets (`MAILJET_*`, `SANITY_STUDIO_*`) fetched via Doppler at session start into `.env.local`
- Deployed on Vercel
- If you discover a convention or constraint not listed here, add it to this file and commit it
