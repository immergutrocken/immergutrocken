# End-to-End Tests

This directory contains end-to-end tests for the Immergutrocken project using Playwright.

## Overview

The e2e tests validate the complete workflow across both the Sanity CMS and the public website:
- Creating and editing content in Sanity Studio (using Chromium)
- Viewing content on the website (using WebKit)
- Verifying changes propagate correctly

## Test Strategy

- **Browser Selection**:
  - Chromium for Sanity Studio interactions
  - WebKit for website verification
- **Dataset**: Uses a dedicated `SANITY_DATASET_E2E` dataset that is reset before each test run
- **Deployment**: Tests run against Vercel preview deployments, not localhost

## Running Tests

### Prerequisites

```bash
# Install dependencies
pnpm install

# Install Playwright browsers (first time only)
npx playwright install chromium webkit
```

### Local Development

**Important**: Always run e2e tests locally before committing changes to ensure they pass.

Tests can run against localhost (default) or deployed instances:

```bash
# Run all e2e tests against localhost
# Make sure CMS is running on localhost:3333 and website on localhost:3000
pnpm run test:e2e

# Run tests in UI mode (interactive)
pnpm run test:e2e:ui

# Run tests in debug mode
pnpm run test:e2e:debug

# Show test report
pnpm run test:e2e:report
```

**Running against localhost:**
1. Start the CMS: `cd apps/cms && pnpm dev` (runs on http://localhost:3333)
2. Start the website: `cd apps/website && pnpm dev` (runs on http://localhost:3000)
3. Run tests: `pnpm run test:e2e`

**Running against deployed instances:**
```bash
# Set environment variables for deployed URLs
export CMS_BASE_URL="https://your-cms-deployment.vercel.app"
export WEBSITE_BASE_URL="https://your-website-deployment.vercel.app"
export SANITY_DATASET_E2E="e2e-test"
export SANITY_API_TOKEN="your-token"
pnpm run test:e2e
```

### Environment Variables

Optional for local testing (defaults to localhost):
- `CMS_BASE_URL`: URL of the Sanity Studio (default: "http://localhost:3333")
- `WEBSITE_BASE_URL`: URL of the public website (default: "http://localhost:3000")

Required for dataset reset:
- `SANITY_STUDIO_PROJECT_ID`: Sanity project ID (default: "05hvmwlk")
- `SANITY_DATASET_E2E`: Name of the E2E dataset (e.g., "e2e-test")
- `SANITY_API_TOKEN`: Sanity API token with write permissions for dataset reset

## CI/CD

Tests run automatically via GitHub Actions:
1. Gets the latest Vercel deployment for the current branch
2. Resets the E2E dataset
3. Runs tests against the deployed instances
4. Uploads test reports as artifacts

**Note**: The workflow gets the latest deployment instead of waiting for a new one. This is important when only e2e test files change, as no new deployment is triggered.

See `.github/workflows/e2e-tests.yml` for the workflow configuration.

## Test Structure

```
e2e/
├── artist.cms.spec.ts       # CMS tests (Chromium)
├── artist.website.spec.ts   # Website tests (WebKit)
├── artist-lifecycle.spec.ts # Combined lifecycle test
└── helpers/
    └── reset-dataset.ts     # Dataset reset utility
```

## Dataset Management

The E2E dataset is automatically reset before each test run to ensure a clean state. This is done using the `resetE2EDataset()` helper function.

**Important**: The `SANITY_DATASET_E2E` dataset should be dedicated to E2E tests only and should not contain production data.

## Best Practices

1. **Run tests before committing**: Always run `pnpm run test:e2e` locally before committing changes
2. **Keep tests independent**: Each test should be able to run in isolation
3. **Use descriptive names**: Test data should be easily identifiable (e.g., "E2E Test Artist")
4. **Clean dataset**: The dataset is reset before tests, so don't rely on existing data
5. **Test real workflows**: Focus on user journeys, not implementation details
6. **Handle async properly**: Wait for network requests and state updates

## Troubleshooting

### Tests fail with "Page not found"

Ensure the deployment URLs are correct and the services are running.

### Dataset reset fails

Check that:
- `SANITY_API_TOKEN` has write permissions
- `SANITY_DATASET_E2E` dataset exists in the Sanity project
- Network connectivity to Sanity API is available

### Timeouts

If tests timeout:
1. Check network connectivity to the deployed instances
2. Increase timeout values in `playwright.config.ts` if needed
3. Verify the deployed instances are responding correctly
