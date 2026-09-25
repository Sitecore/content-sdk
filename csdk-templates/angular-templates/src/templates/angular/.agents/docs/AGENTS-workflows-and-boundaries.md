# Workflows and boundaries (Angular)

Optional, on-demand detail. Guardrails stay in [AGENTS.md](../../AGENTS.md).

## Example agent tasks

- **Add a new Sitecore component:** Create a standalone component under `src/app/components/` with `fields` / `params` / `rendering` inputs and a default export, render its fields with `*scText` / `*scImage` / `*scLink`, then regenerate the map (`npm run sitecore-tools:generate-map`, or leave `npm run dev` running). The rendering name in Sitecore must match the exported class name.
- **Add a new loader:** Create `src/content-sdk/loaders/<name>.loader.ts` as a plain `LoaderFn` with static imports only — no `inject()`. Export it from `src/content-sdk/loaders/index.ts` and add it to the `LOADERS` object. Attach `loaderResolver('<key>')` to the route in `src/app/app.routes.ts`. Verify the result is JSON-serializable.
- **Add an Express endpoint:** Register it in `src/server.ts` **before** `express.static` and the SSR handler, and after `express.json()` if it reads a body. If it should be exempt from multisite/redirects/personalize, add it to `middlewareMatcher.excludePaths`.
- **Add an environment variable:** Decide whether it is browser-safe. Browser-safe → name it `CSDK_PUBLIC_*` so `scripts/generate-environment.ts` emits it into `environment*.ts`. Server-only → read it from `process.env` in `src/server.ts` or `sitecore.config.ts`. Either way, document it in `.env.example` with a placeholder.
- **Change routing:** Update `src/app/app.routes.ts` **and** the matching `ServerRoute` entry in `src/app/app.routes.server.ts` (render mode and HTTP status) together.
- **Change Sitecore configuration** (locales, loader cache, link prefetch, multisite, redirects, personalize): edit **`sitecore.config.ts`** and pass the value in the **first argument** of `defineConfig`, which the app currently ships as an empty `{}`. For example `defineConfig({ angular: { locales: ['en', 'fr-FR'] } }, environment)`. The `scConfig` object other files import is the resolved, read-only result — never assign to it at runtime, and do not duplicate the value at a call site.

## Boundaries

**Never edit:** `node_modules/`, `dist/`, `.angular/`.

**Generated — do not hand-edit:** `.sitecore/component-map.ts`, `.sitecore/sites.json`, `.sitecore/metadata.json`, `src/environments/environment.dev.ts`, `src/environments/environment.prod.ts`. Regenerate them with `npm run sitecore-tools:generate-map`, `npm run sitecore-tools:build`, and `npm run gen:env:dev` / `gen:env:prod`.

**Environment variables:** You may add new ones when needed. Add the variable to `.env.example` with a placeholder or comment; never put real secrets in example files. If editing `.env` for local dev, add only the variable name and tell the user to set the value. **Never commit** `.env` — it is gitignored.

**Edit with care:**

- `src/server.ts` — middleware order and the shared `middlewareMatcher`
- `src/app/app.config.ts` — provider set; `provideClientHydration()` is intentionally absent
- `src/app/app.routes.ts` + `src/app/app.routes.server.ts` — must stay in sync
- `src/content-sdk/loaders/**` — the no-Angular-DI rule applies; see [AGENTS-loaders-and-di.md](AGENTS-loaders-and-di.md)
- `sitecore.config.ts` — the single place Sitecore configuration changes; structural overrides in `defineConfig`'s first argument, secrets and endpoints from env only
- `angular.json` — `fileReplacements`, SSR entry, `allowedCommonJsDependencies`

**Focus on:** `src/app/components/`, `src/app/pages/`, `src/app/shared/`, `src/content-sdk/loaders/`, `src/server.ts`, `sitecore.config.ts`.

**Verify:** `npm run build` (also type-checks — there is no separate `type-check` script) and `npm run lint`. For SSR behaviour, `npm start` and exercise both a full page load and a client-side navigation, since the two take different loader paths.

**For head applications / empty starters:** Keep this app's `AGENTS.md` as the guide. Do not replace it with the Content SDK monorepo root `AGENTS.md` — that file describes the SDK source tree, not the head application.
