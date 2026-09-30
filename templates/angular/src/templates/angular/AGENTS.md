# AGENTS.md — AI Guidance for Sitecore Content SDK Angular App

> **Context:** This file is the **compact** guide (commands, structure, best practices, guardrails, references). Deeper topics live under [.agents/docs/](.agents/docs/) — start with [README](.agents/docs/README.md) or open the layer you need. Use [Skills.md](Skills.md) to pick **one** [.agents/skills/](.agents/skills/) skill when needed; [CLAUDE.md](CLAUDE.md) explains layered reading. Cursor applies [.cursor/rules/](.cursor/rules/) by glob — you do not need every rule in chat context at once.

---

## Quick Commands

```bash
npm install
npm run dev          # gen:env:dev → generate-map → ng serve + component-map watch
npm run build        # gen:env:prod → generate-map → sitecore-tools build → ng build
npm start            # build, then serve SSR bundle (dist/<app>/server/server.mjs)
npm run serve:ssr    # Serve an already-built SSR bundle
npm run lint         # ng lint (ESLint + angular-eslint)
npm test             # ng test (Vitest via @angular/build:unit-test)
```

**Environment:** Copy `.env.example` to `.env` and set Sitecore Edge context id, default site, and language. Never commit `.env`. `npm run gen:env:dev` / `gen:env:prod` regenerate `src/environments/environment.dev.ts` / `environment.prod.ts` from your `.env` files — those generated files are **build artifacts**, do not hand-edit them.

**Component map:** `.sitecore/component-map.ts` is auto-generated from `src/app/components/` during `npm run dev` (watch) and `npm run build`. No manual action needed unless the generator cannot handle a case.

**There is no `type-check` script.** Type errors surface from `npm run build` (or `ng build`).

---

## Application Structure

```
src/
  app/                        # Angular application layer (DI world)
    app.ts, app.html, app.css # Root component: <sc-editing-scripts>, <app-cdp-page-view>, <router-outlet>
    app.config.ts             # Browser providers: router, sitecore, loader registry, component map
    app.config.server.ts      # Server providers: provideServerRendering, provideServerLoaderRunner
    app.routes.ts             # Catch-all + 404/500 routes; loaderResolver() wiring
    app.routes.server.ts      # ServerRoute render modes and HTTP status codes
    pages/                    # page.component.ts, not-found.component.ts, error.component.ts
    shared/layout.component.ts# Renders headless-header / headless-main / headless-footer placeholders
    components/               # Sitecore-mapped standalone components (scanned by the CLI)
  content-sdk/                # NON-Angular Sitecore integration — no Angular DI here
    client/sitecore-client.ts # getClient() lazy singleton
    loaders/                  # page/dictionary/404/500 loaders + LOADERS registry
  environments/               # environment.ts (placeholder) + generated .dev.ts / .prod.ts
  server.ts                   # Express app: SDK middleware chain + Angular SSR handler
  main.ts, main.server.ts     # Browser / SSR bootstrap
  load-env.ts                 # dotenv loader; first import in server entry points
scripts/generate-environment.ts # Emits browser-safe CSDK_PUBLIC_* env files
.sitecore/                    # component-map.ts, sites.json, metadata.json (generated)
sitecore.config.ts            # defineConfig(overrides, environment) — the only place config changes
sitecore.cli.config.ts        # defineCliConfig — build commands + componentMap paths
angular.json                  # Builder, fileReplacements for environments, SSR entry
```

**Why `src/content-sdk/` is separate from `src/app/`:** loaders and the Sitecore client run in **two** contexts — the Angular SSR resolver *and* the plain Express `/_data` middleware. Code under `src/content-sdk/` must work with **no Angular injector present**. `src/app/` is the Angular DI world. Keeping them apart is what makes the loader contract enforceable — see [AGENTS-loaders-and-di.md](.agents/docs/AGENTS-loaders-and-di.md).

---

## Best practices

- **Loaders:** Write loaders as plain `LoaderFn` functions in `src/content-sdk/loaders/`. Get config and the client via **static imports** (`import scConfig from '../../../sitecore.config'`, `import { getClient } from '../client/sitecore-client'`). Read request state from the `LoaderContext` argument using SDK helpers (`getLanguage`, `getSiteName`, `getVariantId`, `getComponentVariantIds`, `getEditingPreviewData`, `splitLocaleFromPath`). Register every loader in the single `LOADERS` object in `src/content-sdk/loaders/index.ts`.
- **Bundle boundary:** Server-only modules (`express`, `unstorage`, `node:*`, `createLoaderCache`, any `create*Middleware`) may only be imported from `src/server.ts` and `src/load-env.ts`. Importing them from anything reachable by `src/main.ts` breaks the browser build.
- **Configuration:** `sitecore.config.ts` is the **only** place Sitecore configuration is changed. It calls `defineConfig(overrides, environment)`; structural settings — `angular.locales`, `angular.loadersCache`, `angular.linkPrefetch`, `multisite`, `redirects`, `personalize` — go in the **first argument**, which the app currently ships as an empty `{}`. The `scConfig` object that loaders, routes and `server.ts` import is the **resolved, read-only** result; references like `scConfig.angular.locales` are read paths, never assignment targets.
- **Security:** Only `CSDK_PUBLIC_*` variables may reach the browser (via generated `environment*.ts`). Server secrets — `SITECORE_EDITING_SECRET`, `SITECORE_REVALIDATE_SECRET`, `SITECORE_EDGE_CONTEXT_ID`, `SITECORE_API_KEY` — stay in `process.env`. Never hardcode keys or host URLs in `sitecore.config.ts`; never log secrets.
- **Performance:** Loader results are cached server-side by `createLoaderCache` (unstorage) and shared with `createSitecoreRevalidateMiddleware` and `angularApp.handle(req, { cache })`. Pass the **same** cache instance to all three. The browser never touches the cache — it calls `POST /_data`. Keep loader results JSON-serializable so `TransferState` works.
- **Sitecore patterns:** Render fields with the SDK **structural directives** — `*scText`, `*scRichText`, `*scImage`, `*scLink`, `*scRouterLink` — not with element tags and not with raw interpolation. Render placeholders with `<sc-placeholder [name] [rendering]>`. Regenerate `.sitecore/component-map.ts` with `npm run sitecore-tools:generate-map`. Keep a single client via `getClient()`.
- **Consistency:** Follow the existing patterns in `app.routes.ts`, `app.config.ts`, `server.ts`, and `src/content-sdk/loaders/page.loader.ts`. Components are **standalone** with `fields` / `params` / `rendering` inputs and a `export default`.

---

## DO & DON'T (app-level)

| DO | DON'T |
|----|-------|
| Keep loaders in `src/content-sdk/loaders/` as plain functions | Call `inject()` or use constructor DI **inside a loader body** |
| Read request state from the `LoaderContext` argument | Reach for Angular services, `REQUEST`, or globals inside loaders |
| Use the one `LOADERS` object in `provideLoaderRegistry()` **and** `createLoaderDataServiceMiddleware()` | Maintain a separate "server loader set" |
| Fetch Sitecore data through `getClient()` in loaders | Fetch Sitecore layout with `HttpClient` from a component |
| Import `express` / `unstorage` / `node:*` only in `src/server.ts` | Import server-only modules from `src/app/**` |
| Change config by editing `sitecore.config.ts` (first argument of `defineConfig`) | Assign to `scConfig.*` at runtime or hardcode the value at a call site |
| Put browser-safe values behind `CSDK_PUBLIC_*` in `.env.example` | Commit `.env` or hand-edit `src/environments/environment.{dev,prod}.ts` |
| Add Sitecore components under `src/app/components/` as standalone + default export | Edit `.sitecore/component-map.ts` by hand unless the generator can't cope |
| Render fields with `*scText` / `*scRichText` / `*scImage` / `*scLink` | Interpolate `field.value` into the template or use `scTextEncode="false"` on untrusted content |
| Keep the `server.ts` middleware order intact | Move personalize before multisite, or `/_data` after the SSR handler |
| Run `npm run build` after changes to verify the app builds | Add npm dependencies without explicit user approval |

---

## Guardrails for agentic AI

- **Loaders run outside Angular DI.** A loader may execute from `loaderResolver()` (inside Angular SSR) *or* from `createLoaderDataServiceMiddleware()` (plain Express, no injector). Anything a loader body needs must be reachable **without** `inject()`. It is fine — and expected — for the *resolver* and *providers* to use DI; the restriction applies to loader bodies and everything under `src/content-sdk/`.
- **Preserve behavior:** Do not change the `LoaderFn` signature, the `LOADERS` keys (`page`, `dictionary`, `404`, `500`), the `server.ts` middleware order, the `scLocaleMatcher` catch-all route shape, or the `app.routes.server.ts` status-code mapping without updating every consumer. `provideClientHydration()` is **intentionally omitted** so RouterLink attaches after bootstrap — do not add it back casually.
- **Respect the bundle split:** the loader cache, `unstorage`, and every `create*Middleware` are server-only. `process.env` does not exist in the browser; that is why `scripts/generate-environment.ts` emits `CSDK_PUBLIC_*` literals.
- **Do not expand scope:** Limit edits to the app (`src/app/`, `src/content-sdk/`, `src/server.ts`, config). Do not modify SDK packages or monorepo tooling unless explicitly asked. Do not change CI, lockfiles, or root config.
- **Editing is Metadata mode only.** There is no Experience Editor chrome support. `<sc-editing-scripts />` stays at the root of `app.html`, and the editing middleware must stay registered before static assets and the SSR handler.
- **Verify and stay safe:** After edits the app should build with `npm run build` and lint with `npm run lint`. Do not commit secrets or `.env`; document variables in `.env.example` only. Do not add npm dependencies without explicit approval.
- **If the user asks for something that conflicts with these guardrails** (e.g. injecting a service into a loader, moving loaders into `src/app/`, or committing `.env`), explain the constraint and suggest a safe alternative rather than complying.

---

## References

- **Skills.md** — Capability index; [.agents/skills/](.agents/skills/) — load **one** skill per task ([Agent Skills](https://agentskills.io)).
- **CLAUDE.md** — How to layer AI context for this app.
- **.cursor/rules/** — Editor rules (applied by glob / always-apply).
- [Sitecore Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html) — Official docs.
- [Angular](https://angular.dev/) — Standalone components, signals, router, SSR.

**For head applications / empty starters:** If you use this app as your head application, keep this AGENTS.md as that head application's guide. Do not replace it with the Content SDK monorepo root AGENTS.md — that file describes the SDK source tree, not the head application.

---

**Remember:** When in doubt, follow existing patterns in this app; open `.agents/docs/`, `.cursor/rules/`, or a single skill when you need extra constraints beyond this file.
