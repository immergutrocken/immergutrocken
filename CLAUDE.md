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

## Code Review
- PRs are reviewed automatically by **Gemini Code Assist** (free, GitHub App)
- Gemini is configured via `.gemini/config.yaml` — update that file when conventions here change
- After Gemini (or any reviewer) leaves comments, always respond to every thread:
  - If fixed: reply with ✅ and a short explanation of what changed
  - If already correct / outdated: reply with ✅ or 👀 explaining why no change is needed
  - If intentionally not fixing: reply with ⏭️ and the reasoning
  - GitHub has no reaction tool available — use emoji-prefixed replies instead
- Work directly on the PR branch — don't create a new branch per fix session
- PRs are opened as **draft**. Only mark ready for review after: (1) CI is green and (2) the user explicitly gives permission. Use `mcp__github__update_pull_request` with `draft: false` to promote.
- After promoting, if Gemini does not post a review within a few minutes, trigger it manually by posting `/gemini review` as a PR comment via `mcp__github__add_issue_comment`.
