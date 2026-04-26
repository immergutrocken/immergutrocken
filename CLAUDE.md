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
- Path alias: `@/*` → `./src/*` in website

## Conventions
- TypeScript strict mode everywhere — no `any`
- i18n via `next-intl`; locales `de` (default) and `en`
- Environment variables are not committed — pull via `vercel env pull`
- Deployed on Vercel
