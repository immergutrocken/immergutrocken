# e2e

End-to-end tests spanning the immergutrocken apps, using Playwright with
WebKit (most visitors use Safari on iOS). Lives outside `apps/*` since e2e
tests aren't scoped to a single app.

This is a first proof of concept (issue #551): it loads one statically
seeded artist page and asserts structure (title, banner image) — not full
visual-regression screenshots yet.

## One-time setup

The `e2e-test` Sanity dataset must already contain a matching artist document
(see `fixture-data.ts` for the expected slug/title/banner alt text) and a
`generalSettings` document with banner images set. The Sanity project
ID/dataset are public and hardcoded in `playwright.config.ts` — no `.env`
file needed.

## Running locally

```sh
pnpm install
pnpm --filter e2e exec playwright install webkit
pnpm run test:e2e
```

This starts `apps/website` in dev mode against the `e2e-test` dataset, then
runs the Playwright suite against it in WebKit.

Also runs in CI on every PR/push to `main` (see
`.github/workflows/e2e-tests.yml`) — no secrets or env setup needed there
either.

## Scope / non-goals for this PoC

- The test suite itself never mutates Sanity data — content is seeded and
  maintained manually in Sanity Studio.
- No screenshot-based visual regression yet — only structural assertions.
