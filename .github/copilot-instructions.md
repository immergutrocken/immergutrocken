# immergutrocken – Copilot & Contributor Instructions

## 1. Coding & Testing Standards

### TypeScript Changes & Testing

- All changes to TypeScript files must include or update relevant unit tests.
- Test-driven development (TDD) is encouraged: consider writing or updating tests before implementing changes.

## 2. Pull Request & Dependency Update Workflow

### Major Dependency Updates

- When updating major dependencies (e.g., React, Tailwind, Sanity), expect breaking changes and review release notes.
- Test all affected areas thoroughly and document any breaking changes and their resolutions in the PR.
- If a major tool (like ESLint) requires a config migration, handle it in a separate, focused PR.
- **Strategic Separation**: Complex migrations (e.g., Tailwind CSS v4, ESLint v9) should be handled in separate PRs due to their extensive configuration requirements.
- **Incremental Validation**: After each major dependency update, immediately run builds and tests to catch breaking changes early.
- **Framework Compatibility**: Major framework updates (React v19, Next.js v15) may require updates to testing configurations and mocking strategies.
- **Import Path Changes**: Major version updates often change import paths and API signatures (e.g., react-player v3 changed from `react-player/youtube` to `react-player` with different props).

### Validation Checklist

- After dependency updates or major changes, always:
  - Run linting (ESLint, Stylelint)
  - Run all tests (Jest, etc.)
  - Build all apps (CMS, website)
  - Check TypeScript for errors
  - Validate Vercel preview deployments for both apps
- **Comprehensive Testing**: Ensure 100% statement/function/line coverage, particularly for utility files like sanityClient.ts.
- **Iterative Validation**: Run validation after each significant change rather than batching all updates together.
- **Console Error Monitoring**: Address all console errors and warnings during test runs, especially React DOM prop validation issues.
- **Mock Strategy Updates**: Update Jest mocking for ES modules and React component compatibility when upgrading major framework versions.

### SonarQube Quality Gate

- All PRs are checked by SonarQube Cloud.
- PRs should not be merged if the Quality Gate fails (e.g., insufficient test coverage or code issues).
- **Coverage Targets**: Maintain 100% statement/function/line coverage for all new code and critical utility files.
- **New Code Coverage**: Pay special attention to "Coverage on New Code" metrics which must meet the 80% threshold.
- **Test Completeness**: Add comprehensive tests for all configuration files, client initialization, and utility functions.

### Vercel Bot & Deployment Previews

- Each PR triggers Vercel preview deployments for all apps.
- The Vercel bot posts deployment URLs and status in the PR for easy inspection.

### PR Review & Merge Requirements

- At least one approving review is required to merge.
- All checks (CI, SonarQube, Vercel, etc.) must pass before merging.

### Cleanup & Deprecated Packages

- Remove deprecated or unused packages as part of dependency update PRs.
- Keep type packages up to date and remove them if the main package now includes types.
- **Version Verification**: Always verify that updated packages are actually the latest available versions before considering the update complete.
- **Dependency Auditing**: Regularly check for packages that have been superseded or are no longer maintained.
- **Breaking Change Documentation**: Document all breaking changes encountered and their resolutions for future reference.

### Dependency Update Strategy

- **Batch Updates Carefully**: Group related dependencies together but separate complex migrations.
- **Framework-First Approach**: Update core frameworks (React, Next.js) first, then their ecosystem packages.
- **Test Early and Often**: Run the full validation checklist after each significant dependency group update.
- **Migration Guides**: Always consult official migration guides for major version updates before proceeding.
- **Rollback Strategy**: Be prepared to exclude problematic major updates and handle them in separate PRs.
- **Build Tool Updates**: PostCSS plugins, bundler configurations may need updates with CSS framework changes.

---

## 3. Project Context

### Overview

- This repository contains the codebase for the "Immergutrocken" project. It is organized as a monorepo using pnpm workspaces and TurboRepo for managing multiple applications and packages.

### Structure

- **apps/cms/**: Sanity CMS configuration and customizations.
- **apps/website/**: Next.js frontend for the public website.
- **Shared Configs**: Root contains configuration files for pnpm, TurboRepo, SonarQube, etc.

### Key Technologies

- Monorepo: pnpm workspaces, TurboRepo
- Frontend: Next.js (React), TypeScript, Tailwind CSS, SCSS
- CMS: Sanity.io
- Testing: Jest
- Code Quality: SonarQube

### Development

- Use `pnpm` for installing dependencies and running scripts.
- Use `turbo` for running tasks across the monorepo.
- Each app/package has its own `package.json` and configuration files.

### Development Workflows

- Before making code changes: Create a PR and add a plan as a comment.
- After making code changes: Run tests, lint, build, and check previews.

### Notes

- The `cms` app is for editors and content management.
- The `website` app is the public-facing site.
- Static assets are under each app's `public/` or `static/` directories.

### Branching & PR Conventions

- Use descriptive branch names.
- Reference related issues in PRs.
- Add a plan as a comment before code changes.
- Ensure all checks pass before review.
- At least one approval required before merging to `main`.

### CI/CD Overview

- Automated workflows run on each PR and push to `main`.
- Checks: linting, unit tests, build verification.
- Deployments are triggered on successful builds.

### Environment Setup

- Node.js: Use version in `.nvmrc` or `package.json`.
- pnpm: Install globally with `npm install -g pnpm`.
- Other tools: TurboRepo, Sanity CLI, etc.
- Environment variables: Copy `.env.example` to `.env` and fill in required values.

### Common Commands

| Command          | Description              | Location |
| ---------------- | ------------------------ | -------- |
| `pnpm install`   | Install dependencies     | root     |
| `pnpm dev`       | Start development server | each app |
| `pnpm build`     | Build the app            | each app |
| `pnpm lint`      | Run linter               | each app |
| `pnpm test`      | Run tests                | each app |
| `pnpm turbo ...` | Run turbo tasks          | root     |

### Deployment Process

- Deployments are handled via Vercel.
- Preview deployments for each PR, with Vercel bot posting URLs and status.
- Staging and production environments may exist.
- Manual deployment steps (if any) are in the respective app's README.

### Contact & Support

- For questions, contact maintainers in `package.json` or via team channels.
- For urgent issues, open a GitHub issue and tag relevant team members.

### Known Issues or Gotchas

- If you change any `package.json`, update the lock file (`pnpm-lock.yaml`) by running `pnpm install`.
- Some dependencies may require specific Node or pnpm versions.
- If you encounter build/install errors, try clearing the pnpm cache.
- Sanity Studio may require a valid API token.
- See open issues for current bugs or limitations.
- **React 19 Compatibility**: Jest mocking strategies need updates for React 19 compatibility - use async imports instead of CommonJS require().
- **Tailwind CSS v4**: Requires significant configuration migration and new PostCSS plugin setup - handle separately.
- **Import Path Changes**: Major versions often change import paths (e.g., `react-player/youtube` → `react-player`).
- **Framework Updates**: Major framework updates may require updating test configurations, mocking strategies, and build tools.
- **Coverage Thresholds**: SonarQube requires 80% coverage on new code - ensure comprehensive test coverage for all new/modified files.

---

---

## 4. Lessons Learned from Complex Dependency Updates

### Key Insights from Major Version Updates

Based on complex dependency update PRs (React v19, Tailwind v4, Sanity v4, etc.), the following practices have proven essential:

#### Planning and Approach
- **Separate Complex Migrations**: Major version updates requiring configuration changes (ESLint v9, Tailwind v4) should be handled in dedicated PRs.
- **Research Migration Guides**: Always review official migration documentation before starting major version updates.
- **Identify Breaking Changes**: Expect API changes, import path modifications, and configuration requirements.

#### Execution Strategy
- **Incremental Updates**: Update and validate framework dependencies first, then ecosystem packages.
- **Immediate Validation**: Run full build/test cycle after each major dependency group to catch issues early.
- **Multiple Validation Rounds**: Be prepared for iterative fixes as compatibility issues emerge.

#### Testing and Coverage
- **Framework Compatibility**: Major React/Jest updates require mock strategy updates and test configuration changes.
- **Comprehensive Coverage**: Maintain 100% statement/function/line coverage, especially for utility files.
- **Console Error Resolution**: Address all test console errors, particularly React DOM validation warnings.

#### Common Breaking Changes
- **Import Paths**: Libraries often change import structures in major versions (e.g., `react-player/youtube` → `react-player`).
- **API Changes**: Props, method signatures, and configuration options frequently change.
- **Build Dependencies**: CSS frameworks may require new PostCSS plugins or build tool updates.
- **Mocking Strategies**: ES module compatibility and React component mocking need updates.

#### Quality Assurance
- **Version Verification**: Always double-check that packages are updated to the actual latest versions.
- **SonarQube Compliance**: Ensure new code coverage meets the 80% threshold throughout the process.
- **Build Validation**: Verify all applications build successfully before considering updates complete.

Feel free to update this file with more details about workflows, deployment, or conventions as the project evolves.
