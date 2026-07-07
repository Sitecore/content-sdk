# Project overview (monorepo)

This repository is the **Sitecore Content SDK** — a TypeScript monorepo of SDK packages, scaffolding CLI, and samples for building applications with Sitecore XM Cloud or Sitecore AI. AI agents work as developer assistants to implement features, fix bugs, add tests, and maintain templates.

**Scope:** This guidance is for the **Content SDK monorepo** only. For head applications created with `create-content-sdk-app`, use the `AGENTS.md` generated inside that head application (from the template). Do not copy this repo's root `AGENTS.md` into a head application.

**Main tasks:** Generate SDK code, perform safe edits in packages and templates, update tests. Do not modify global config (CI, root tooling) without explicit instruction.

## Tech stack

- **Language:** TypeScript (Node LTS)
- **Package manager:** Yarn 4.12.0. Workspaces: `packages/*`, `samples/*`
- **Build:** `tsc` → `dist/`; templates bundled via `scripts/build-templates.ts`
- **Tests:** Mocha + Sinon + Chai; coverage via `nyc`
- **Lint/format:** ESLint + Prettier
- **Runtime:** Node LTS; do not import from `dist/`; CLI entry `./dist/index.js`

## MCP

Sitecore Documentation MCP: https://sitecore.mcp.kapa.ai

## Links

- [Sitecore Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html)
- [Creating a Content SDK App](https://doc.sitecore.com/sai/en/developers/content-sdk/20/creating-a-content-sdk-app.html)
- [XM Cloud](https://doc.sitecore.com/sai)
