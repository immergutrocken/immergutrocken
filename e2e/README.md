# End-to-End Tests

This directory contains end-to-end tests for the Immergutrocken project using Playwright.

## Overview

The e2e tests validate the complete workflow across both the Sanity CMS and the public website:
- Creating and editing content in Sanity Studio (using Chromium)
- Viewing content on the website (using WebKit)
- Verifying changes propagate correctly

## Test Strategy

- **Browser selection**: Chromium for Sanity Studio interactions, WebKit for website verification
- **Dataset**: Uses a dedicated `e2e-test` Sanity dataset that is reset before each test run
- **Servers**: Both apps start as local dev servers — Playwright's `webServer` config handles this automatically
- **Auth**: The `SANITY_API_TOKEN` is injected into the browser's localStorage in `globalSetup` so no manual login to Studio is needed

## Running Tests

### Prerequisites

```bash
# Install dependencies
pnpm install

# Install Playwright browsers (first time only)
npx playwright install chromium webkit
```

### Local Development

**Important**: Always run e2e tests locally before committing changes.

Playwright starts both dev servers automatically before running tests:

```bash
# Required env vars (add to your shell or .env.local at root)
export SANITY_API_TOKEN="your-token-with-editor-access"

# Run all e2e tests (servers start automatically)
pnpm run test:e2e

# Run tests in UI mode (interactive, great for debugging)
pnpm run test:e2e:ui

# Run tests in debug mode
pnpm run test:e2e:debug

# Show last test report
pnpm run test:e2e:report
```

If both dev servers are already running on their default ports (3333, 3000), Playwright reuses them instead of starting new ones.

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SANITY_API_TOKEN` | Yes | — | Token with editor access; used for dataset reset and Studio auth injection |
| `SANITY_STUDIO_PROJECT_ID` | No | `05hvmwlk` | Sanity project ID |
| `SANITY_DATASET_E2E` | No | `e2e-test` | Name of the dedicated E2E dataset |

## CI/CD

Tests run automatically via GitHub Actions (`.github/workflows/e2e-tests.yml`).

The workflow:
1. Installs dependencies
2. Installs Playwright browsers
3. Runs `pnpm test:e2e` — Playwright starts both dev servers pointed at the `e2e-test` dataset, runs all tests, then stops them
4. Uploads the HTML report as an artifact

Only one run is allowed at a time (`concurrency: cancel-in-progress: false`) to prevent dataset interference.

### Required GitHub secret

| Secret | Purpose |
|--------|---------|
| `SANITY_API_TOKEN` | Dataset reset + Studio auth injection |

## Test Structure

```
e2e/
├── global-setup.ts          # Resets dataset + saves Sanity auth state
├── artist-lifecycle.spec.ts # Full happy path (Chromium + WebKit)
├── artist.cms.spec.ts       # CMS-only tests (Chromium)
├── artist.website.spec.ts   # Website-only tests (WebKit)
├── helpers/
│   └── reset-dataset.ts     # Dataset reset utility
└── .auth/                   # Playwright auth state (gitignored)
```

### Test Files

- **global-setup.ts**: Resets the `e2e-test` dataset and saves Sanity Studio auth state to `e2e/.auth/storage-state.json`
- **artist-lifecycle.spec.ts**: Full happy path — create artist (Chromium) → view on website (WebKit) → edit (Chromium) → verify change (WebKit). Since the website runs as a dev server (`next dev`), CMS changes are visible immediately.
- **artist.cms.spec.ts**: CMS-focused tests using the `cms-chromium` project (baseURL: `http://localhost:3333/dev`)
- **artist.website.spec.ts**: Website-focused tests using the `website-webkit` project (baseURL: `http://localhost:3000`)

## Dataset Management

The `e2e-test` dataset is reset automatically in `globalSetup` before any test runs. It is dedicated to E2E tests and must never contain production data.

## Troubleshooting

### Studio shows login screen (auth not working)

The `globalSetup` injects `SANITY_API_TOKEN` into localStorage under key `__sanity_auth_token_05hvmwlk`. If the Studio still shows a login screen, open DevTools on `http://localhost:3333/dev` after a manual login and run `Object.keys(localStorage)` to find the actual key Sanity v4 uses, then update `global-setup.ts` accordingly.

### Dev servers fail to start

- Ensure ports 3333 and 3000 are free (or set `reuseExistingServer` is working for already-running servers)
- Check that all required env vars are set

### Dataset reset fails

- Verify `SANITY_API_TOKEN` has write permissions on the `e2e-test` dataset
- Confirm the `e2e-test` dataset exists in the Sanity project (`05hvmwlk`)
