# E2E Tests for Sanity CMS

This directory contains end-to-end tests for the Sanity Studio CMS using Playwright.

## Overview

The e2e tests validate the complete workflow of managing content in the Sanity CMS, including:
- Creating, editing, and deleting artists
- Form validation
- Content publishing workflow

## Test Setup

### Prerequisites

- Node.js (version specified in `.nvmrc`)
- pnpm 10.33.0
- Playwright browsers installed

### Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers (only needed first time)
npx playwright install chromium
```

### Environment Variables

The tests require the following environment variables (optional for local testing):

- `SANITY_STUDIO_DATASET`: The Sanity dataset to use (default: from sanity.config.ts)
- `SANITY_STUDIO_EMAIL`: Email for authentication (if required)
- `SANITY_STUDIO_PASSWORD`: Password for authentication (if required)
- `SANITY_STUDIO_BASE_URL`: Base URL of the Sanity Studio (default: http://localhost:3333)

## Running Tests

### Local Development

```bash
# Run all e2e tests
pnpm run test:e2e

# Run tests in UI mode (interactive)
pnpm run test:e2e:ui

# Run tests in debug mode
pnpm run test:e2e:debug

# Show test report
pnpm run test:e2e:report
```

### CI/CD

Tests are automatically run on:
- Pull requests to `main`
- Pushes to `main`

The GitHub Actions workflow is defined in `.github/workflows/e2e-tests.yml`.

## Test Structure

```
e2e/
├── artist.spec.ts       # Tests for artist creation/management
├── auth.setup.ts        # Authentication setup (if needed)
├── fixtures.ts          # Test fixtures and utilities
└── .auth/              # Stored authentication state (gitignored)
```

## Authentication Strategy

The tests use Playwright's authentication mechanism to:
1. Authenticate once before all tests (if required)
2. Reuse the authentication state across tests
3. Store the session in `e2e/.auth/user.json` (gitignored)

Note: Sanity Studio may not require explicit authentication for local development environments.

## Data Management

### Test Data Cleanup

Tests should clean up their own data by:
1. Creating test documents with identifiable names (e.g., "Test Artist E2E")
2. Deleting the documents at the end of the test
3. Using unique identifiers to avoid conflicts

### Dataset Strategy

For CI/CD, consider using:
- A separate test dataset (e.g., `test` or `e2e-tests`)
- A dataset that can be reset/cleaned between test runs
- Sanity's dataset import/export features for reproducible test data

You can configure this via the `SANITY_STUDIO_DATASET` environment variable.

## Test Coverage

Current test coverage includes:
- ✅ Artist creation workflow
- ✅ Required field validation
- ✅ Form interaction
- ✅ Publishing workflow
- ✅ Data cleanup

Future coverage should include:
- [ ] Image upload
- [ ] Social media links
- [ ] Performance scheduling
- [ ] Multi-language content
- [ ] Other document types (articles, partners, etc.)

## Troubleshooting

### Tests fail with "Page not found"

Ensure the Sanity Studio dev server is running:
```bash
pnpm dev
```

The Playwright config includes a webServer that auto-starts the dev server, but you can run it manually if needed.

### Authentication issues

If tests fail due to authentication:
1. Check that environment variables are set correctly
2. Review the authentication setup in `e2e/auth.setup.ts`
3. Update the authentication flow to match your Sanity configuration

### Timeouts

If tests timeout:
1. Increase timeout in `playwright.config.ts`
2. Check network connectivity
3. Ensure the Sanity Studio loads correctly in a browser

## Best Practices

1. **Keep tests independent**: Each test should be able to run in isolation
2. **Clean up after tests**: Delete created documents to avoid test data buildup
3. **Use descriptive names**: Make test data easily identifiable
4. **Handle flakiness**: Use proper waits and retries for network operations
5. **Test real workflows**: Focus on user journeys, not implementation details

## References

- [Playwright Documentation](https://playwright.dev/)
- [Sanity Studio Documentation](https://www.sanity.io/docs/sanity-studio)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
