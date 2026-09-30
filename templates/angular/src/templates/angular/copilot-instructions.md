# GitHub Copilot — Sitecore Content SDK Angular App

For AI agent instructions, commands, and coding rules in this application, use:

- **`AGENTS.md`** — Canonical source: overview, commands, Angular app structure, DO/DON'T, guardrails, boundaries.
- **`CLAUDE.md`** — How to layer AI context for this app (start with `AGENTS.md`; add detail only when needed).
- **`Skills.md`** and **`.agents/skills/`** — Capability index and per-task skills ([Agent Skills](https://agentskills.io)); load **one** matching skill per task.
- **`.cursor/rules/`** — Editor rules (applied by glob; open the rule that matches your task).

**Commands:** `npm install`, `npm run dev`, `npm run build`, `npm run lint`, `npm test`. Copy `.env.example` → `.env`; never commit secrets or `.env` files.

**Angular-specific rules that are easy to get wrong:**

- Loaders live in `src/content-sdk/loaders/`, not `src/app/`. Loader bodies must **not** use Angular DI (`inject()`, constructor injection, Angular services) — they also run from plain Express middleware. Use static imports of `sitecore.config.ts` and `getClient()`, and read request state from the `LoaderContext` argument.
- One `LOADERS` registry object feeds both `provideLoaderRegistry()` in `src/app/app.config.ts` and `createLoaderDataServiceMiddleware()` in `src/server.ts`.
- `express`, `unstorage`, `node:*`, and the loader cache are server-only — never import them from `src/app/**`.
- Only `CSDK_PUBLIC_*` variables reach the browser, via the generated `src/environments/environment.{dev,prod}.ts`. Those files are build artifacts; do not hand-edit them.
- Render fields with the structural directives `*scText`, `*scRichText`, `*scImage`, `*scLink`, `*scRouterLink`; render placeholders with `<sc-placeholder [name] [rendering]>`.
- Sitecore components go under `src/app/components/` as standalone components with `fields` / `params` / `rendering` inputs and a default export; `.sitecore/component-map.ts` is generated.

Do not edit `node_modules/`, `dist/`, `.angular/`, or generated files under `.sitecore/`; do not commit `.env`; do not modify SDK packages unless explicitly asked.

**Docs:** [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html)
