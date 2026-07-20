# Immergutrocken Monorepo

## Package Manager
- Always use `pnpm` — never npm or yarn

## Commands
- Install: `pnpm install`
- Dev: `turbo run dev`
- Build: `turbo run build` — run after every change to verify compilation
- Test: `turbo run test`
- E2E: `turbo run test:e2e` (also runs in CI, see `.github/workflows/e2e-tests.yml`)
- Lint: `turbo run lint`

## Structure
- `apps/website` — Next.js 15 SSG, **Pages Router** (not App Router), TypeScript strict, Tailwind
- `apps/cms` — Sanity Studio 4, headless CMS
- `packages/e2e` — Playwright e2e tests spanning both apps; lives outside `apps/*` for that reason
- Website app structure uses top-level folders such as `components`, `lib`, and `pages` (no documented `src/` alias)

## Conventions
- TypeScript strict mode everywhere — avoid `any` when possible, and document exception cases
- i18n via `next-intl`; locales `de` (default) and `en`
- No `.env` files committed — secrets (`MAILJET_*`, `SANITY_STUDIO_*`) fetched via Doppler at session start into `.env.local`
- Deployed on Vercel
- `turbo.json` tasks run in strict env mode: any `process.env.*` a task's script reads must be listed in that task's `env` array in `turbo.json`, or turbo strips it from the subprocess (only OS defaults like `PATH`/`HOME` pass through automatically) — e.g. `CI` had to be added explicitly for Playwright's CI-aware config to see it
- GitHub Actions workflows need an explicit `permissions:` block (CodeQL flags workflows that don't limit `GITHUB_TOKEN` scope) — `contents: read` is enough unless a step needs more
- If you discover a convention or constraint not listed here, add it to this file and commit it

## E2E testing (`packages/e2e`)
- WebKit only (most visitors are on Safari/iOS), against a dedicated public/read-only Sanity dataset `e2e-test` (project `05hvmwlk`) — not a secret, hardcoded in `playwright.config.ts` and CI, no `.env` needed
- Runs the site under test via `next dev`, not `next build && next start` — a production build statically exports *every* page, which would require `e2e-test` to have fixture data for the whole site; dev mode only renders the page actually requested
- The **Sanity MCP tools have no binary asset upload** — only document CRUD. Anything needing a real image (e.g. the artist page's required banner) has to be seeded/edited manually in Sanity Studio; MCP can only handle the non-image singleton docs (`menu`, `sortings`) a page's `getStaticProps` chain depends on
- Locator preference: role/text/alt/href over `data-testid` — the site's existing semantic markup (headings, `next/image` alt text, link hrefs) already gives unique, meaningful selectors without editing `apps/website` source just for testability

## Code Review
- PRs are reviewed automatically by **Gemini Code Assist** (free, GitHub App)
- Gemini is configured via `gemini-code-assist.yaml` in the repo root — update that file when conventions here change
