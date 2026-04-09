# Immergutrocken Monorepo

## Stack
- pnpm + Turborepo monorepo
- apps/website, apps/cms
- TypeScript strict mode throughout
- Deployed on Vercel

## Commands
- Build: `turbo run build`
- Test: `turbo run test`
- Lint: `turbo run lint`
- Install: `pnpm install`

## Rules
- Never use npm or yarn, always pnpm
- Run `turbo run build` after any change to verify compilation
- TypeScript strict mode, no `any`
