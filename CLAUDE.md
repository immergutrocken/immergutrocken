# Immergutrocken Monorepo

## Package Manager
- Always use `pnpm` — never npm or yarn
- Dependencies are pinned to exact versions everywhere (no `^`/`~`); Renovate (`renovate.json`) raises upgrade PRs so every bump gets a CI run. `pnpm add` writes a caret by default — strip it afterwards
- A newly published version has to age 5 days before it can get in, enforced in two places that must stay in sync:
  - `renovate.json` — `minimumReleaseAge: "5 days"`, so a compromised publish has time to be yanked before it reaches a PR. `internalChecksFilter: "strict"` keeps a too-fresh version from being offered as a lower "best available" update instead of being skipped entirely. Security fixes from vulnerability alerts override the delay (`vulnerabilityAlerts.minimumReleaseAge: null`)
  - `pnpm-workspace.yaml` — `minimumReleaseAge: 7200` (pnpm counts **minutes**, Renovate takes a duration string). This is the backstop Renovate can't provide: it covers manual `pnpm add`/`pnpm update` and applies to **transitive** deps too, where Renovate only manages the direct ones in `package.json`. Default is `0` on pnpm 10 (it becomes `1440` in pnpm 11), so it has to be set explicitly
- The pnpm setting only affects *resolution*, so `pnpm install --frozen-lockfile` is unaffected and CI can't be blocked by it. Never set the pnpm value higher than Renovate's, or Renovate's own lockfile regeneration would be refused by pnpm after Renovate had already accepted the version
- Hand-editing `pnpm-lock.yaml` is normally wrong — but stripping a caret is the exception, because `specifier:` only mirrors `package.json` and the resolved version doesn't change. Edit `package.json` plus the matching `specifier:` line, then prove consistency with `pnpm install --frozen-lockfile` (and a plain `pnpm install` that comes out as a no-op). Letting pnpm regenerate instead — `--lockfile-only` *or* a plain `install` after the edit — re-resolves the whole tree and drags in unrelated transitive bumps (verified: `@emnapi/runtime`, `debug`, `semver`, `detect-libc` all moved). Never hand-edit resolutions, integrity hashes or dependency trees

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
- In sandboxed sessions that reach the network through a TLS-inspecting proxy (e.g. Claude Code on the web), strict env mode also strips `NODE_EXTRA_CA_CERTS`/proxy vars, so anything fetching Sanity through turbo fails with `SELF_SIGNED_CERT_IN_CHAIN` — `turbo run build` can't be verified there. Run the tool directly instead (e.g. `packages/e2e/node_modules/.bin/playwright test`), which inherits the environment and works
- GitHub Actions workflows need an explicit `permissions:` block (CodeQL flags workflows that don't limit `GITHUB_TOKEN` scope) — `contents: read` is enough unless a step needs more
- If you discover a convention or constraint not listed here, add it to this file and commit it

## E2E testing (`packages/e2e`)
- WebKit only (most visitors are on Safari/iOS), against a dedicated public/read-only Sanity dataset `e2e-test` (project `05hvmwlk`) — not a secret, hardcoded in `playwright.config.ts` and CI, no `.env` needed
- Runs the site under test via `next dev`, not `next build && next start` — a production build statically exports *every* page, which would require `e2e-test` to have fixture data for the whole site; dev mode only renders the page actually requested
- The **Sanity MCP tools have no binary asset upload** — only document CRUD. Anything needing a real image (e.g. the artist page's required banner) has to be seeded/edited manually in Sanity Studio; MCP can only handle the non-image singleton docs (`menu`, `sortings`) a page's `getStaticProps` chain depends on
- Visual regression via **Argos** (`@argos-ci/playwright`): baselines are hosted by Argos, never committed. Uploads only happen when `CI` is set, authenticated with the `ARGOS_TOKEN` repo secret; approving/rejecting a diff needs a human in the Argos UI (no MCP/API path for it)
- Visual regression is the primary coverage mechanism — one screenshot per page, in a single test that navigates, waits and shoots. Hand-written assertions are limited to what pixels can't show (document title, `href`s, `<head>`) plus a visibility check on the slowest content that doubles as the pre-screenshot wait. Don't add a structural assertion for something the screenshot already covers
- Anything whose pixels depend on the current date or live data must be masked in `argosScreenshot()` — currently the footer countdown; `argosScreenshot()` itself already disables animations and waits for images/fonts
- The webkit project sets `browserName` explicitly on top of `devices["Desktop Safari"]`: the device descriptor only carries `defaultBrowserType`, and Argos' reporter reads `browserName` to decide whether its Chromium-only font flags apply
- Argos picks a PR's baseline from an approved build whose commit is an **ancestor of the merge base with the base branch** — so a build only ever compares against `main`, never against an earlier build on the same branch. Until a build lands on `main`, every PR build is an **orphan** ("n added", check red) no matter how the pixels look; approving one doesn't create a baseline. The first push to `main` is what establishes it
- Argos re-approves automatically when a new build's screenshot is byte-identical to an already-approved one — a human decision is only needed when the pixels actually change
- Vercel's ignored build step skips both deployments when a commit only touches `packages/e2e`, so PRs there show "Canceled by Ignored Build Step" as success — that is not a failure
- Locator preference: role/text/alt/href over `data-testid` — the site's existing semantic markup (headings, `next/image` alt text, link hrefs) already gives unique, meaningful selectors without editing `apps/website` source just for testability

## Code Review
- PRs are reviewed automatically by **Greptile** (GitHub App) on the free **Starter plan**: 50 credits/month, 1 active developer, unlimited repos — a standard review costs 1 credit. It replaced Gemini Code Assist, whose consumer version Google shut down on 2026-07-17
- Configured per repo via `greptile.json` in the repo root, which **overrides** the Greptile dashboard settings for this repo. Field reference: https://www.greptile.com/docs/code-review/greptile-json-reference
- Greptile indexes `CLAUDE.md` automatically, so conventions documented here already feed into reviews — `greptile.json` only carries the review-behaviour settings plus per-path rules (`customContext.rules` with glob `scope`s). Keep the rules in sync when conventions here change; don't duplicate this file wholesale into it
- Credit budget shapes the config: `triggerOnUpdates` is `false`, so a PR costs one credit when it's opened instead of one per push, and `excludeAuthors` skips `renovate[bot]` so dependency PRs don't eat the month
- Account settings (AI training opt-out, plan, App installation) live in the Greptile web UI — there is no MCP server or API path for them

## PR workflow
- The goal is that a human only reviews once everything that can run automatically has run. So the draft state means "CI still running or work unfinished", not "waiting for a human to press a button"
- Claude opens PRs as drafts, then **marks them ready for review itself** once CI is green and it is satisfied with the change — that is also what triggers the Greptile review (`triggerOnDrafts` is `false`), so it lands on the finished state instead of the first push. Exception: if the change involves a decision Claude is genuinely unsure about, leave it as a draft and ask instead of flipping it
- Whatever Greptile then reports, Claude addresses on the same branch; the follow-up pushes cost no extra credit (`triggerOnUpdates` is `false`). Merging stays a human decision
