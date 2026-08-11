# Immergutrocken Monorepo

## Package Manager
- Always use `pnpm` — never npm or yarn
- Dependencies are pinned to exact versions everywhere (no `^`/`~`); Renovate (`renovate.json`) raises upgrade PRs so every bump gets a CI run. `pnpm add` writes a caret by default — strip it afterwards
- A newly published version has to age 5 days before it can get in. This is enforced in **two** layers, `renovate.json` and `pnpm-workspace.yaml`, because neither covers what the other does:
  - `renovate.json` — `minimumReleaseAge: "5 days"`, so a compromised publish has time to be yanked before it reaches a PR. `internalChecksFilter: "strict"` filters pending (too-fresh) releases and skips the update when no older non-pending version qualifies; it is already Renovate's default and is set explicitly only so it can't drift. Don't switch it to `flexible` (proposes the pending version anyway once *all* candidates are pending, and makes PRs "flap" between versions) or `none` (disables the filtering entirely, defeating the whole setting)
  - **Security fixes are currently delayed too, despite `vulnerabilityAlerts.minimumReleaseAge: null`.** Under `strict` the patched release is dropped as pending during datasource lookup, *before* the `vulnerabilityAlerts` override is merged, so Renovate builds the `[SECURITY]` PR from the highest non-pending version — which can still be inside the vulnerable range while the PR claims to fix it (renovatebot/renovate#44065, acknowledged upstream, unfixed). So **check the target version of any `[SECURITY]` PR against the advisory's patched version by hand**; bump it manually if it falls short. The override stays configured so the behaviour corrects itself once upstream lands the fix
  - `minimumReleaseAgeBehaviour` is left at its default `timestamp-required`, so a release whose datasource reports no timestamp counts as unstable rather than sailing through the age gate. Don't set it to `timestamp-optional`
- `pnpm-workspace.yaml` — `minimumReleaseAge: 7200` (5 days in minutes; pnpm counts minutes where Renovate takes a duration string). This is the backstop Renovate can't provide: transitive deps and manual `pnpm add`/`pnpm update`. **It requires pnpm 11 — do not re-add it if the repo is ever moved back to pnpm 10**, where it OOM-kills Mend-hosted Renovate:
  - On pnpm 10 the age check needs publish timestamps, which the abbreviated packument omits, so it pulls the **full packument** for every package and roughly doubles peak memory of `pnpm install --lockfile-only --recursive` — the command Renovate runs to regenerate the lockfile. Mend caps a job at 3.0 GB, so it is killed part-way through the first branch and *no* dependency PRs get processed, security ones included. `--network-concurrency=4` doesn't help — the memory is retained version metadata, not in-flight requests
  - pnpm 11 fixed the cause rather than the symptom: the age check moved to the **abbreviated metadata endpoint** (11.0), the trust-meta cache stopped retaining whole packuments (11.3), and a cold-resolution regression retaining raw JSON bodies was fixed in pnpm#12870 — filed as pnpm#12868 by someone hitting this same Mend 3.0 GB cap. Measured on this repo, cold cache, full re-resolution: **pnpm 11.20 with the gate at 5 days = 998 MB / 16s**, against **pnpm 10.33 with no gate at all = 1666 MB / 26s**. The gate on now costs less than the gate off used to
  - Known sharp edge, unrelated to memory: pnpm's fallback when the newest match is too fresh is still wrong (pnpm#11203, open) — it can resolve to a lower version than the best eligible one. A pin younger than the gate is the case that bites, as `@argos-ci/playwright@7.4.2` did on pnpm 10: lockfile regeneration fails, so the PR carries a `package.json` change with **no lockfile** and CI dies at `ERR_PNPM_OUTDATED_LOCKFILE`. The gate can't block `--frozen-lockfile` directly, but it blocks CI by leaving the two out of sync. Use `minimumReleaseAgeExclude` for a package that has to land fresh
  - Switching to Dependabot would not have avoided the pnpm 10 problem either: it regenerates the pnpm lockfile the same way, and its `cooldown` conflicts with pnpm's setting in the same manner (dependabot/dependabot-core#13165, open)
  - pnpm 11 would default `minimumReleaseAge` to 1440 (1 day) anyway; the explicit 7200 is what raises it to our 5 days
- Running **pnpm 11** (pinned exactly in `packageManager`, which is what `pnpm/action-setup` reads — the workflows take their pnpm version from there, not from a `version:` input). What the pnpm 10 → 11 upgrade needed here, for reference:
  - `onlyBuiltDependencies` is gone; `allowBuilds` (a map of package name → boolean) replaces it. `strictDepBuilds` now defaults to `true`, so a dependency wanting to run a build script is an **error** rather than a warning until it is answered explicitly — pnpm writes `set this to true or false` placeholders into `pnpm-workspace.yaml`, and the install keeps failing until each one is a real boolean
  - Node 22+ is required, so every workflow needs an explicit `actions/setup-node` rather than the runner default
  - `pnpm install` wants to purge a `node_modules` built by pnpm 10 and aborts with `ERR_PNPM_ABORTED_REMOVE_MODULES_DIR_NO_TTY` when there is no TTY. `CI=true` (as in CI) makes it proceed
  - Settings only pnpm 11 understands are **ignored, not rejected**, by pnpm 9 and 10 — verified against this workspace file. That matters because pnpm 11 still writes `lockfileVersion: '9.0'`, and Vercel maps that to "pnpm 9 or 10" (its table stops at 10). The deploy is safe either way: pnpm 10 self-switches to the `packageManager` version, and pnpm 9 installs from the lockfile unchanged. `ENABLE_EXPERIMENTAL_COREPACK=1` on the Vercel project would make it use pnpm 11 directly, but is not required
- Renovate retries a failed artifact (lockfile) step only when a package file needs updating, the branch goes conflicted, the rebase checkbox is ticked, or the PR title starts with `rebase!`. **Merging `main` into the branch is not a retry trigger** — a stuck PR stays stuck until one of those happens
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
