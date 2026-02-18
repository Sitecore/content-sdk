# AGENTS.md — AI Guidance for Sitecore Content SDK

## Project Overview

This repository is the **Sitecore Content SDK** — a TypeScript monorepo of SDK packages, scaffolding CLI, and samples for building applications with Sitecore XM Cloud. AI agents work as developer assistants to implement features, fix bugs, add tests, and maintain templates.

**Main tasks:** Generate SDK code, perform safe edits in packages and templates, update tests. Do not modify global config (CI, root tooling) without explicit instruction.

---

## Quick Commands

```bash
yarn install              # From repo root — installs all workspaces
yarn build                # Build all packages
yarn lint-packages        # Lint packages
yarn lint-samples         # Lint samples
yarn test-packages        # Run tests
yarn coverage-packages    # Coverage report
yarn api-extractor:verify # Verify public API surface (required by CI)
yarn reset                # Clean, reinstall, rebuild
```

**Per-package:** `cd packages/<name>` then `yarn build`, `yarn lint`, `yarn test`.

**Package manager:** Yarn 4.12.0. Workspaces: `packages/*`, `samples/*`.

---

## Repository Structure

```
content-sdk/
├── packages/
│   ├── core/                  # @sitecore-content-sdk/core — core SDK
│   ├── nextjs/                # @sitecore-content-sdk/nextjs — Next.js integration
│   ├── react/                 # @sitecore-content-sdk/react — React components
│   ├── content/               # @sitecore-content-sdk/content — content client
│   ├── cli/                   # @sitecore-content-sdk/cli — CLI tools
│   ├── search/                # @sitecore-content-sdk/search
│   ├── personalize/           # @sitecore-content-sdk/personalize
│   ├── events/                # @sitecore-content-sdk/events
│   ├── analytics-core/        # @sitecore-content-sdk/analytics-core
│   └── create-content-sdk-app/ # Scaffolding CLI + templates
├── samples/                   # Example applications (generated from templates)
└── scripts/                   # Monorepo scripts (scaffold, lint, hooks)
```

**Key locations:**
- **Sources:** `src/**` in each package
- **Templates:** `packages/create-content-sdk-app/src/templates/` — Next.js, Next.js App Router
- **Environment variables:** `.env.*.example` in templates; never commit `.env`
- **Initializers:** `packages/create-content-sdk-app/src/initializers/` — drive scaffolding via `Initializer.init(args)`
- **When working inside a scaffolded app** (e.g. under `samples/`), use that app’s **AGENTS.md** for app-level guidance; this file applies to the monorepo and packages.

### Which package to edit?

| Task | Package |
|------|---------|
| GraphQL/cache/retry utilities | `packages/core` |
| Content fetching, layout, editing | `packages/content` |
| Next.js integration, middleware | `packages/nextjs` |
| React components (Text, Image, etc.) | `packages/react` |
| CLI tooling | `packages/cli` |
| Scaffolding, templates, init flow | `packages/create-content-sdk-app` |
| Search, personalize, events, analytics | Respective packages |

### Working with samples

- **Generate samples:** `yarn scaffold-samples` (uses `scripts/samples.json`)
- **Develop templates live:** Copy `packages/create-content-sdk-app/watch.json.example` → `watch.json`, set `destination` under `samples/`, run `yarn watch` from `packages/create-content-sdk-app`
- **Lint samples:** `yarn lint-samples` (scaffolded apps)

---

## Code Style

- Use existing patterns in the package you edit
- **Naming:** camelCase (variables), PascalCase (components/types), UPPER_SNAKE (constants), kebab-case (directories)
- Keep functions small and focused; prefer pure functions
- JSDoc for public APIs: `@param`, `@returns`
- For full standards: see `.cursor/rules/` and `CLAUDE.md`

---

## Testing

- **Stack:** Mocha + Sinon + Chai; coverage via `nyc`
- **Run:** `yarn test-packages` (root) or `yarn test` in a package
- **Coverage:** `yarn coverage-packages`
- **API surface:** `yarn api-extractor:verify` — run when adding/removing public exports; update `api/` reports if intentional (see `CONTRIBUTING.md`)
- Update tests when changing behavior; ensure they pass before completing

---

## DO & DON'T Rules

| DO | DON'T |
|----|-------|
| Use existing utilities and common code | Edit `dist/**` or other build output |
| Follow patterns in templates and packages | Change env vars or commit `.env` files |
| Ensure template edits build with `npm install && npm run build` | Add dependencies without explicit approval |
| Drive CLI flows via `Initializer.init(args)` | Modify `yarn.lock` / `package-lock.json` unless required |
| Reuse common processes (see `src/common/`) | Rewrite folder structure or move files arbitrarily |
| Run `yarn build` after template changes | Touch CI or global config without explicit instruction |
| Run `yarn api-extractor` when changing public exports | Modify `.github/workflows/` without instruction |

---

## Boundaries

**Never edit:** `dist/**`, `.next/`, `out/`, `build/` (compiled output), `node_modules/`. Do not modify `yarn.lock` or `package-lock.json` unless explicitly required.

**Environment variables:** You may add new env vars when needed. Do it carefully: document the variable in `.env.example` (or in templates, the appropriate `.env.*.example`), with a placeholder or empty value and a short comment; never put real secrets or production values in example files. If adding to a user’s `.env.local` for local dev, add only the variable name (e.g. `MY_VAR=`) and instruct the user to set the value. **Never commit** `.env` or `.env.local` — they are gitignored; example files are the source of truth for what vars exist.

**Never edit without explicit instruction:**
- `.github/workflows/` — CI configuration
- Root tooling (scripts, lerna config) — unless tasked

**Focus on:**
- `src/**` in packages
- `packages/create-content-sdk-app/src/templates/**`
- `*.test.ts`, `*.spec.ts`

---

## Example Agent Tasks

### 1. Add a utility in a package
Example: Add a constant in `packages/core/src/constants.ts`:
- Export from `packages/core/src/index.ts` if public
- Add JSDoc: `@internal` or full `@param`/`@returns` for public APIs
- Add tests in `packages/core/src/constants.test.ts` (if needed)
- Run `yarn api-extractor` if you change public exports

### 2. Fix a failing test
```bash
yarn test-packages
# Or: cd packages/content && yarn test
```
- Locate the failing `*.test.ts` file
- Preserve intended behavior; fix assertions or implementation
- Re-run tests before completing

### 3. Change a scaffolding template
- Edit under `packages/create-content-sdk-app/src/templates/nextjs/` or `nextjs-app-router/`
- Use `.env.remote.example` for env vars (never `.env`)
- Verify: Run `yarn watch` (with `watch.json`) or `yarn scaffold-samples`, then `npm install && npm run build` in the generated sample

---

## Git Workflow

- **Development branch:** `dev` (main development branch)
- **Create feature branch:** `git switch -c feature/my-content-sdk-feature`
- **PR target:** Open Pull Requests against `dev` (not `main`)
- **CI:** Lint, tests, and API surface verification must pass before merge
- See `CONTRIBUTING.md` for full workflow

---

## Detailed Rules Reference

This file is a quick reference. For comprehensive guidance:

- **`.cursor/rules/`** — project-context, safety, repo-structure, code-style, sitecore, testing, cli
- **`CLAUDE.md`** — full guide (tech stack, Sitecore patterns, CLI, safety)
- **`CONTRIBUTING.md`** — development workflow, branching, PR process

---

## Links

- [Sitecore Content SDK Documentation](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html)
- [Creating a JSS App for XM Cloud](https://doc.sitecore.com/xmc/en/developers/content-sdk/creating-a-jss-app-for-xm-cloud.html)
- [XM Cloud Documentation](https://doc.sitecore.com/xmc)

---

**Remember:** When in doubt, refer to `.cursor/rules/` and `CLAUDE.md` for detailed patterns and examples.
