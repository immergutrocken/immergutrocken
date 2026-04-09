# Immergutrocken Development Strategy

## Executive Summary

This document outlines the comprehensive development strategy for the Immergutrocken monorepo project. It provides strategic direction for maintaining code quality, managing dependencies, implementing features, and ensuring operational excellence across the dual-app architecture (CMS and Website).

## Project Architecture

### Monorepo Structure
- **Root**: Shared configurations (pnpm, TurboRepo, SonarQube, Git hooks)
- **apps/cms**: Sanity.io-based content management system
- **apps/website**: Next.js-based public-facing website
- **Tooling**: pnpm workspaces + TurboRepo for orchestration

### Technology Stack

#### Frontend (Website)
- **Framework**: Next.js 15.5.7 with React 19.1.1
- **Styling**: Tailwind CSS 3.4.16, SCSS, PostCSS
- **Internationalization**: next-intl 4.3.5
- **Analytics**: Vercel Analytics & Speed Insights
- **Media**: react-player for video content
- **Image Handling**: @plaiceholder/next for blur placeholders

#### CMS
- **Platform**: Sanity.io v4.6.0
- **Extensions**: Sanity Assist, Vision, Vercel Deploy plugin
- **Localization**: German locale support

#### Testing & Quality
- **Test Framework**: Jest 30.1.3 with jsdom environment
- **Testing Library**: @testing-library/react 16.3.0
- **Coverage Target**: 100% statement/function/line coverage for critical utilities
- **Quality Gate**: SonarQube Cloud (80% minimum on new code)

#### Linting & Formatting
- **ESLint**: 9.39.4 with TypeScript, React, and Prettier plugins
- **Stylelint**: 16.23.1 for CSS/SCSS
- **Prettier**: 3.6.2 with Tailwind plugin
- **Pre-commit**: Husky + lint-staged

#### Deployment
- **Platform**: Vercel
- **CI/CD**: GitHub Actions
- **Preview**: Automatic preview deployments on PRs

## Strategic Principles

### 1. Quality First
- Maintain TypeScript strict mode across all code
- Enforce 100% test coverage on critical utilities
- Never merge PRs with failing quality gates
- Address all console errors and warnings

### 2. Incremental Progress
- Make small, focused changes
- Validate after each significant modification
- Separate complex migrations into dedicated PRs
- Test early and often

### 3. Documentation-Driven Development
- Document all breaking changes
- Maintain up-to-date migration guides
- Keep copilot instructions current
- Add plan as comment before implementation

### 4. Dependency Hygiene
- Follow semantic versioning principles
- Separate major updates from minor/patch updates
- Remove deprecated packages proactively
- Verify versions are actually latest

### 5. Security & Performance
- Never commit secrets to source code
- Optimize bundle size through code splitting
- Use Next.js image optimization
- Monitor Vercel Speed Insights metrics

## Development Workflows

### Feature Development Workflow

```
1. Issue Creation
   ↓
2. Branch Creation (descriptive name)
   ↓
3. PR Creation + Plan Comment
   ↓
4. Implementation (with TDD approach)
   ↓
5. Local Validation (lint + test + build)
   ↓
6. Push + CI Validation
   ↓
7. Vercel Preview Check
   ↓
8. SonarQube Quality Gate
   ↓
9. Code Review (1+ approvals)
   ↓
10. Merge to main
```

### Dependency Update Strategy

#### Minor/Patch Updates
- Group related packages together
- Run validation checklist once per group
- Single PR for multiple minor updates acceptable

#### Major Updates - Framework First Approach
```
Phase 1: Core Frameworks
- React, Next.js, TypeScript
- Immediate validation after each
- Update test configurations
- Fix breaking changes

Phase 2: Ecosystem Packages
- UI libraries, utilities
- Framework-dependent packages
- Validate incrementally

Phase 3: Build Tools
- PostCSS, Tailwind plugins
- Bundler configurations
- CSS processors

Phase 4: Developer Tools
- ESLint, Prettier, Stylelint
- Testing libraries
- Type definitions
```

#### Complex Migrations (Separate PRs)
- Tailwind CSS major versions
- ESLint configuration migrations
- React Router or state management
- CMS platform updates

### Validation Checklist

After any significant change, execute in order:

```bash
# 1. Install dependencies
pnpm install

# 2. Run linters
turbo run lint
# Or per-app: cd apps/website && pnpm run lint

# 3. Run tests with coverage
turbo run test:ci
# Or per-app: cd apps/website && pnpm run test:ci

# 4. Build all apps
turbo run build
# Or per-app: cd apps/website && pnpm run build

# 5. Check TypeScript
# (Covered by build, but can run separately)
tsc --noEmit

# 6. Verify Vercel previews
# (Check PR for Vercel bot comments)
```

## Code Quality Standards

### TypeScript Guidelines
- **Strict Mode**: Always enabled, no exceptions
- **No `any`**: Use proper types or `unknown`
- **Type Imports**: Use `import type` for type-only imports
- **Consistent Patterns**: Follow existing codebase patterns

### Testing Requirements
- **Unit Tests Required**: For all TypeScript changes
- **Test Coverage**: 100% for utility functions, 80% minimum for new code
- **Test Organization**: Mirror source file structure in `__tests__`
- **Naming**: `*.test.ts` or `*.test.tsx`
- **TDD Encouraged**: Write tests before implementation when feasible

### Component Standards
- **Functional Components**: Use hooks, avoid class components
- **PropTypes**: Use TypeScript interfaces instead
- **Accessibility**: Follow WCAG 2.1 AA standards
- **Internationalization**: Use next-intl for all user-facing text
- **Styling**: Tailwind CSS first, SCSS modules for complex cases

### File Organization
```
apps/website/
├── pages/           # Next.js pages (routing)
├── components/      # React components
├── lib/            # Business logic, API clients
├── styles/         # Global styles, SCSS modules
├── public/         # Static assets
├── __tests__/      # Test files (mirrors structure)
└── messages/       # i18n translations
```

## CI/CD Strategy

### GitHub Actions Workflows

#### Linting (`linting.yml`)
- Triggers: PR to main, push to main
- Actions: ESLint, Stylelint across all apps
- Fast feedback on code style issues

#### Unit Tests (`unit-tests.yml`)
- Triggers: PR to main, push to main
- Actions: Jest with coverage, SonarCloud scan
- Blocks merge on test failures or coverage drops

#### Copilot Setup (`copilot-setup-steps.yml`)
- Documentation for AI-assisted development
- Ensures consistency across contributors

### Vercel Integration
- **Preview Deployments**: Every PR gets unique URLs for both apps
- **Production**: Auto-deploy from main branch
- **Environment Variables**: Managed via Vercel CLI and dashboard
- **Build Settings**: Defined in each app's configuration

### SonarQube Quality Gate
- **Overall Coverage**: 80% minimum on new code
- **Duplications**: < 3% duplication in new code
- **Maintainability**: A rating minimum
- **Reliability**: No critical bugs
- **Security**: No vulnerabilities

## Dependency Management

### Renovate Configuration
- **Enabled**: Automatic dependency update PRs
- **Strategy**: `config:recommended`
- **Grouping**: Related packages grouped together
- **Schedule**: Regular automated checks

### Update Approach
1. **Monitor**: Review Renovate PRs regularly
2. **Prioritize**: Security updates first, then features
3. **Test**: Run validation checklist
4. **Document**: Note breaking changes in PR description
5. **Merge**: Only after all checks pass

### Known Breaking Change Patterns
- **React 19**: Jest mocking requires async imports
- **react-player v3**: Import path changes (`/youtube` → main export)
- **Tailwind v4**: PostCSS plugin migration required
- **ESLint v9**: Flat config format required
- **Next.js 15**: App Router changes, middleware updates

## Risk Management

### Identifying Risks
- Major version jumps across multiple dependencies
- Framework updates affecting test infrastructure
- Breaking changes in build tooling
- Security vulnerabilities in dependencies

### Mitigation Strategies
1. **Incremental Updates**: Never update everything at once
2. **Rollback Plan**: Keep previous version in separate branch
3. **Feature Flags**: For risky feature deployments
4. **Canary Deployments**: Test in preview before production
5. **Documentation**: Comprehensive migration guides

### Incident Response
1. **Detect**: CI failures, SonarQube alerts, Vercel build errors
2. **Assess**: Severity, user impact, rollback necessity
3. **Fix**: Hotfix branch for critical issues
4. **Communicate**: Update issue tracker, notify team
5. **Post-mortem**: Document lesson learned

## Performance Optimization

### Bundle Size
- Monitor with Vercel Analytics
- Use dynamic imports for large components
- Tree-shake unused code
- Optimize third-party imports

### Image Optimization
- Use Next.js Image component
- Implement blur placeholders with plaiceholder
- Serve from Sanity CDN
- Appropriate sizing and formats

### Runtime Performance
- React.memo for expensive components
- useMemo/useCallback for heavy computations
- Virtualization for long lists
- Lazy loading for below-fold content

### Build Performance
- TurboRepo caching
- Incremental builds in Next.js
- Parallel task execution
- Optimized dependency tree

## Security Strategy

### Code Security
- No hardcoded secrets (use environment variables)
- Input validation at all boundaries
- XSS prevention via React defaults
- SQL injection prevention (Sanity handles queries)
- CSRF protection via Next.js defaults

### Dependency Security
- Regular Renovate updates
- npm audit monitoring
- SonarQube security scanning
- Review security advisories

### Deployment Security
- HTTPS only (Vercel default)
- Environment variable encryption
- Access control via Vercel teams
- Sanity token management

## Collaboration Guidelines

### PR Requirements
- **Title**: Descriptive, references issue if applicable
- **Description**: Plan as comment before code changes
- **Size**: Focused changes, split large features
- **Tests**: Included and passing
- **Checks**: All CI checks green
- **Reviews**: 1+ approval required
- **Conflicts**: Resolved before merge

### Code Review Checklist
- [ ] Tests cover new functionality
- [ ] TypeScript strict mode compliant
- [ ] No security vulnerabilities introduced
- [ ] Performance considerations addressed
- [ ] Accessibility standards met
- [ ] Documentation updated if needed
- [ ] Breaking changes documented

### Communication
- **Issues**: For bug reports, feature requests
- **PRs**: For code review discussions
- **Commit Messages**: Clear, conventional format
- **Documentation**: Keep copilot-instructions.md current

## Lessons Learned & Best Practices

### From Major Updates (React 19, Tailwind v4, etc.)

#### Planning
- ✅ Review migration guides before starting
- ✅ Expect configuration changes in major versions
- ✅ Budget extra time for ecosystem updates
- ❌ Don't assume minor version compatibility

#### Execution
- ✅ Update frameworks first, then dependencies
- ✅ Validate after each logical group
- ✅ Fix test infrastructure alongside framework
- ❌ Don't batch unrelated updates

#### Testing
- ✅ Update mocking strategies for new framework versions
- ✅ Address all console warnings
- ✅ Verify coverage before and after
- ❌ Don't ignore failing tests temporarily

#### Quality
- ✅ Verify actual package versions, not assumed
- ✅ Check SonarQube early and often
- ✅ Test build artifacts, not just source
- ❌ Don't merge with failing quality gates

## Future Considerations

### Scalability
- Monitor app for packages workspace potential
- Consider shared component library
- Evaluate build time optimization needs
- Plan for multi-region deployment if needed

### Technology Evolution
- Track Next.js App Router adoption
- Monitor React Server Components maturity
- Evaluate Tailwind v4 migration timeline
- Consider TypeScript 5.x features

### Process Improvements
- Automate more quality checks
- Implement visual regression testing
- Enhance E2E testing coverage
- Streamline deployment process

## Appendix

### Useful Commands Reference

```bash
# Development
pnpm dev                    # Start all apps in dev mode
pnpm --filter website dev   # Start only website
pnpm --filter cms dev       # Start only CMS

# Testing
pnpm test                   # Run tests in watch mode
pnpm test:ci                # Run tests with coverage
turbo run test:ci           # Run all tests in monorepo

# Linting
pnpm lint                   # Lint all code
pnpm --filter website lint  # Lint website only
pnpm eslint                 # ESLint only
pnpm stylelint              # Stylelint only

# Building
pnpm build                  # Build all apps
turbo run build             # Build with Turbo cache

# Vercel
pnpm vercel:login           # Login to Vercel
pnpm vercel:pull-env-website # Pull env vars for website
pnpm vercel:link-website    # Link website project
```

### Key File Locations

```
Root Configuration:
├── package.json            # Root workspace config
├── turbo.json             # TurboRepo task config
├── pnpm-workspace.yaml    # Workspace definitions
├── renovate.json          # Dependency updates
├── sonar-project.properties # Code quality config
└── CLAUDE.md              # AI copilot quick reference

Website App:
├── next.config.mjs        # Next.js configuration
├── tailwind.config.ts     # Tailwind CSS config
├── jest.config.ts         # Jest test config
├── eslint.config.mjs      # ESLint rules
└── .stylelintrc.json      # Stylelint rules

CMS App:
├── sanity.config.ts       # Sanity configuration
├── sanity.cli.ts          # Sanity CLI config
└── deskStructure.ts       # CMS desk structure
```

### Environment Variables

```bash
# Website
MAILJET_API_KEY=           # Email service
MAILJET_API_SECRET=        # Email service
SANITY_STUDIO_PROJECT_ID=  # CMS connection
SANITY_STUDIO_DATASET=     # CMS dataset

# CMS
SANITY_STUDIO_PROJECT_ID=  # Project identifier
SANITY_STUDIO_DATASET=     # Dataset name
```

### Support Resources

- **Documentation**: .github/copilot-instructions.md
- **Quick Reference**: CLAUDE.md
- **GitHub Issues**: Bug reports and feature requests
- **Vercel Dashboard**: Deployment management
- **SonarQube**: Quality metrics and trends
- **Sanity Studio**: Content management

---

*This strategy document should be reviewed and updated quarterly or after major technical decisions.*
