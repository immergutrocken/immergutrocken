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

### Validation Checklist

- After dependency updates or major changes, always:
  - Run linting (ESLint, Stylelint)
  - Run all tests (Jest, etc.)
  - Build all apps (CMS, website)
  - Check TypeScript for errors
  - Validate Vercel preview deployments for both apps

### SonarQube Quality Gate

- All PRs are checked by SonarQube Cloud.
- PRs should not be merged if the Quality Gate fails (e.g., insufficient test coverage or code issues).

### Vercel Bot & Deployment Previews

- Each PR triggers Vercel preview deployments for all apps.
- The Vercel bot posts deployment URLs and status in the PR for easy inspection.

### PR Review & Merge Requirements

- At least one approving review is required to merge.
- All checks (CI, SonarQube, Vercel, etc.) must pass before merging.

### Cleanup & Deprecated Packages

- Remove deprecated or unused packages as part of dependency update PRs.
- Keep type packages up to date and remove them if the main package now includes types.

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

---

Feel free to update this file with more details about workflows, deployment, or conventions as the project evolves.
