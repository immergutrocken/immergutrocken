# e2e

End-to-end tests spanning the immergutrocken apps, using Playwright with
WebKit (most visitors use Safari on iOS). Lives outside `apps/*` since e2e
tests aren't scoped to a single app.

It loads one statically seeded artist page and captures a full-page screenshot
for visual regression via [Argos](https://argos-ci.com).

**Visual regression is the primary coverage mechanism here** — one screenshot
catches any visible change, which is far more ground than a list of structural
assertions could cover. So keep hand-written assertions to the two cases that
earn it:

1. Things the screenshot can't see — the document title, a link's `href`,
   anything in `<head>` or in an attribute rather than in pixels.
2. Readiness: an `expect(...).toBeVisible()` on the slowest content, so the
   screenshot is never taken mid-render.

Anything else visible on the page needs no assertion — if it changes, the diff
shows up in Argos.

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

## Visual regression (Argos)

Screenshots are taken with `argosScreenshot()` and compared against a
baseline that **Argos hosts** — no PNGs live in this repo, so there is
nothing to regenerate on a Linux machine when a change is intentional.

- **Locally** the Argos reporter only writes to `packages/e2e/screenshots`
  (gitignored) — nothing is uploaded and no `ARGOS_TOKEN` is needed.
- **In CI** (`ARGOS_TOKEN` repo secret) the reporter uploads the screenshots
  and Argos posts its own check on the PR.

### Reviewing a flagged build

1. Argos's check turns red with "changes detected" → open the build link on
   the check.
2. Inspect the side-by-side/overlay diff:
   - **Intended change** → click **Approve** in the Argos UI. The check goes
     green, and the screenshot becomes the new baseline once the PR is merged
     into `main`.
   - **Unintended regression** → fix the code and push. CI re-runs and the
     check greens itself again once the pixels match — no approval needed.

There is no Argos MCP server or API-driven review: approving/rejecting a diff
always needs a human in the Argos UI. An assistant can only see whether the
check passed.

### Keeping screenshots stable

`argosScreenshot()` already disables animations/transitions, hides text
carets and waits for images and web fonts before shooting. Anything whose
pixels depend on the current date or on live data has to be masked instead —
currently the footer countdown ("_n_ days left"), see
`tests/artist.spec.ts`. Add a mask when introducing another such element,
otherwise every build after it will diff.

## Scope / non-goals

- The test suite itself never mutates Sanity data — content is seeded and
  maintained manually in Sanity Studio.
- Only the artist page is covered so far. New pages get added the same way:
  one test that navigates, waits, and screenshots.
