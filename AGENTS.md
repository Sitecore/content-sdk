# AGENTS.md — AI Guidance for Sitecore Content SDK

> **Claude Code users:** This file does not include detailed coding rules. Read all `.cursor/rules/*.mdc` files at the start of your session for code style, naming conventions, Sitecore patterns, testing, and safety rules.

## Project Overview

This repository is the **Sitecore Content SDK** — a TypeScript monorepo of SDK packages, scaffolding CLI, and samples for building applications with Sitecore XM Cloud or Sitecore AI. AI agents work as developer assistants to implement features, fix bugs, add tests, and maintain templates.

**Scope:** This file is for the **Content SDK monorepo** only. For head applications created with `create-content-sdk-app`, use the AGENTS.md that was generated inside that head application (from the template). Do not copy this repo's root AGENTS.md into a head application.

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

## Tech Stack

TypeScript (Node LTS), Yarn 4.12.0. Build: `tsc` → `dist/`, templates via `scripts/build-templates.ts`. Testing: Mocha + Sinon + Chai, `nyc`. Lint/format: ESLint + Prettier.

---

## Repository Structure

```
content-sdk/
├── packages/
│   ├── core/                   # @sitecore-content-sdk/core — Foundation: GraphQL client, cache, retry, fetch utilities. No SDK deps.
│   ├── analytics-core/         # @sitecore-content-sdk/analytics-core — Analytics foundation. No SDK deps.
│   ├── content/                # @sitecore-content-sdk/content — Content client: layout, editing, site resolution, media. Depends on core.
│   ├── search/                 # @sitecore-content-sdk/search — Search service and APIs. Depends on core.
│   ├── events/                 # @sitecore-content-sdk/events — Event tracking. Depends on analytics-core.
│   ├── personalize/            # @sitecore-content-sdk/personalize — Personalization. Depends on analytics-core, events.
│   ├── cli/                    # @sitecore-content-sdk/cli — CLI (sitecore-tools). Depends on content.
│   ├── create-content-sdk-app/  # Scaffolding CLI + Next.js templates. Output apps use nextjs + cli.
│   ├── nextjs/                 # @sitecore-content-sdk/nextjs — Next.js integration, middleware, editing. Depends on content, core, react. Final consumer.
│   └── react/                  # @sitecore-content-sdk/react — React components (Text, Image, Placeholder, etc.). Depends on content, core, search. Consumer.
├── samples/                    # Example applications (generated from templates)
└── scripts/                    # Monorepo scripts (scaffold, lint, hooks)
```

**Key locations:** 
- Sources: `src/**` per package. 
- Templates: `packages/create-content-sdk-app/src/templates/`.
- Initializers: `packages/create-content-sdk-app/src/initializers/` via `Initializer.init(args)`.
- Env: `.env.*.example` only; never commit `.env`. 

- Capability groupings and Agent Skills: See [Skills.md](Skills.md) (links to each template’s Skills.md and `.agents/skills/`; skills are maintained in templates only).
- **When working inside a scaffolded app** (e.g. under `samples/`), use that app’s **AGENTS.md** for app-level guidance

### Which package to edit?

| Task | Package |
|------|---------|
| GraphQL, cache, retry, fetch utilities | `packages/core` |
| Analytics foundation | `packages/analytics-core` |
| Content fetching, layout, editing, site, media | `packages/content` |
| Search service | `packages/search` |
| Event tracking | `packages/events` |
| Personalization | `packages/personalize` |
| CLI (sitecore-tools) | `packages/cli` |
| Scaffolding, templates, init flow | `packages/create-content-sdk-app` |
| Next.js integration, middleware, editing | `packages/nextjs` |
| React components (Text, Image, Placeholder, etc.) | `packages/react` |

### Working with samples

`yarn scaffold-samples` (generate); for live template dev: copy `watch.json.example` → `watch.json`, set `destination` under `samples/`, run `yarn watch` from `packages/create-content-sdk-app`; `yarn lint-samples` (lint scaffolded apps).

---

## Code Style

Use existing patterns in the package. **Naming:** camelCase, PascalCase (components/types), UPPER_SNAKE (constants), kebab-case (dirs). Small, focused functions; JSDoc for public APIs (`@param`, `@returns`). Full standards: `.cursor/rules/`

---

## Testing

Mocha + Sinon + Chai; `nyc` for coverage. **Run:** `yarn test-packages` (root) or `yarn test` in a package. **Coverage:** `yarn coverage-packages`. **API surface:** `yarn api-extractor:verify` when changing public exports (see `CONTRIBUTING.md`). Update tests when changing behavior; ensure they pass before completing.

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

**Environment variables:** You may add new env vars when needed. Do it carefully: document the variable in `.env.example` (or in templates, the appropriate `.env.*.example`), with a placeholder or empty value and a short comment; never put real secrets or production values in example files. If adding to a user’s `.env.local` for local dev, add only the variable name (e.g. `MY_VAR=`) and instruct the user to set the value. **Never commit** `.env` or `.env.local` — they are gitignored. See `.cursor/rules/safety.mdc` for full security and secrets guidance.

**Never edit without explicit instruction:**
- `.github/workflows/` — CI configuration
- Root tooling (scripts, lerna config) — unless tasked

**Focus on:**
- `src/**` in packages
- `packages/create-content-sdk-app/src/templates/**`
- `*.test.ts`, `*.spec.ts`

---

## Example Agent Tasks

See `.cursor/rules/agent-tasks.mdc` for step-by-step examples (add utility, fix test, change template).

---

## Git Workflow

Branch: `dev`. Feature: `git switch -c feature/my-content-sdk-feature`. PRs against `dev` (not `main`). CI must pass (lint, tests, API surface). See `CONTRIBUTING.md`.

---

## Detailed Rules Reference

**Canonical source of truth.** Full guidance: **`.cursor/rules/`** (safety, repo-structure, code-style, sitecore, testing, cli, agent-tasks, etc.), **`CONTRIBUTING.md`** (workflow).

---

## MCP

Sitecore Documentation MCP: https://sitecore.mcp.kapa.ai

## Links

[Sitecore Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html) · [Creating a JSS App](https://doc.sitecore.com/xmc/en/developers/content-sdk/creating-a-jss-app-for-xm-cloud.html) · [XM Cloud](https://doc.sitecore.com/xmc)
