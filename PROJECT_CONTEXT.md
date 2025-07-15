# Project Context: immergutrocken

## Overview
This repository contains the codebase for the "Immergutrocken" project. It is organized as a monorepo using pnpm workspaces and TurboRepo for managing multiple applications and packages.

## Structure
- **apps/cms/**: Contains the Sanity CMS configuration and customizations for content management.
- **apps/website/**: Contains the Next.js frontend for the public website, including components, pages, and styles.
- **Shared Configs**: The root contains configuration files for pnpm, TurboRepo, SonarQube, and other tools.

## Key Technologies
- **Monorepo**: Managed with pnpm workspaces and TurboRepo
- **Frontend**: Next.js (React), TypeScript, Tailwind CSS, SCSS
- **CMS**: Sanity.io (custom desk structure, schemas, plugins)
- **Testing**: Jest
- **Code Quality**: SonarQube

## Development
- Use `pnpm` for installing dependencies and running scripts.
- Use `turbo` for running tasks across the monorepo.
- Each app/package has its own `package.json` and configuration files.

## Development Workflows

To maintain code quality and stability, follow these steps for every change:

- **Before making code changes:**
  - Create a Pull Request (PR) for your feature or fix branch.
  - Add a comment in the PR describing your planned changes before making any code modifications. This helps reviewers understand the intent and scope of the work.

- **After making code changes:**
  - **Run Unit Tests:**
    - Execute the test suite to ensure all tests pass.
    - Example: `pnpm test` or use the relevant script in each app.
  - **Run Linting:**
    - Check code style and catch common errors.
    - Example: `pnpm lint` or the app-specific lint script.
  - **Run Build Scripts:**
    - Build the project to verify that everything compiles and works as expected.
    - Example: `pnpm build` or the app-specific build script.

These steps should be performed locally before pushing changes. Automated CI/CD pipelines may also enforce these checks.

## Notes
- The `cms` app is for editors and content management.
- The `website` app is the public-facing site.
- Static assets are organized under each app's `public/` or `static/` directories.

## Branching & PR Conventions

- **Branch Naming:** Use descriptive names, e.g., `feature/short-description`, `fix/issue-description`, or `chore/task-name`.
- **Pull Requests:**
  - Reference related issues in the PR description.
  - Add a plan as a comment before making code changes (see Development Workflows).
  - Ensure all checks pass before requesting review.
- **Reviews:** At least one approval required before merging to `main`.

## CI/CD Overview

- Automated workflows run on each PR and push to `main`.
- Checks include linting, unit tests, and build verification.
- Deployments are triggered on successful builds (details in Deployment Process).

## Environment Setup

- **Node.js:** Use the version specified in `.nvmrc` or `package.json` (engines field).
- **pnpm:** Install globally with `npm install -g pnpm`.
- **Other Tools:** TurboRepo, Sanity CLI, etc. (see individual app READMEs).
- **Environment Variables:** Copy `.env.example` to `.env` and fill in required values for local development.

## Common Commands

| Command            | Description                        | Location         |
|--------------------|------------------------------------|------------------|
| `pnpm install`     | Install dependencies               | root             |
| `pnpm dev`         | Start development server           | each app         |
| `pnpm build`       | Build the app                      | each app         |
| `pnpm lint`        | Run linter                         | each app         |
| `pnpm test`        | Run tests                          | each app         |
| `pnpm turbo ...`   | Run turbo tasks                    | root             |

## Deployment Process

- Deployments are handled via Vercel. Each app is configured to deploy automatically on merges to `main`.
- Preview deployments are created for each Pull Request, with the Vercel bot posting deployment URLs and status as comments in the PR.
- Staging and production environments may exist (see deployment configs or ask maintainers).
- Manual deployment steps (if any) should be documented in the respective app's README.

## Contact & Support

- For questions or support, contact the maintainers listed in `package.json` or reach out via the team Slack/Discord/email.
- For urgent issues, open a GitHub issue and tag the relevant team members.

## Known Issues or Gotchas

- If you change any `package.json` file, make sure to update the lock file (`pnpm-lock.yaml`) by running the install command (`pnpm install`). This keeps dependencies in sync across the workspace.
- Some dependencies may require specific Node or pnpm versions—check `.nvmrc` and `package.json`.
- If you encounter build or install errors, try clearing the pnpm cache: `pnpm store prune && pnpm install`.
- Sanity Studio may require a valid API token for some operations.
- See open issues in the repository for current known bugs or limitations.

---
Feel free to update this file with more details about workflows, deployment, or conventions as the project evolves.
