# Project overview (Angular)

This is a **Sitecore Content SDK** application built with **Angular** (standalone components, signals, Angular SSR) and **TypeScript**. AI agents work as developer assistants within this scaffolded head application. The app integrates with Sitecore AI / XM Cloud for content, supports i18n, multisite, personalization and analytics, and serves SSR through an Express server that also hosts the Content SDK middleware (sitemap, robots, editing, redirects, revalidation, loader data).

**Scope:** This file applies to **this application only** (a scaffolded head app). It is **not** the Content SDK monorepo — for SDK package development use that repo's `AGENTS.md`. Here we edit app code and config (`src/app/`, `src/content-sdk/`, `src/server.ts`, `sitecore.config.ts`); we do not modify SDK packages or CI.

> Terminology note: **Sitecore AI**, **SitecoreAI**, **SAI**, **XM Cloud** and **XMC** all refer to the same hosted platform context in these docs and in template comments. Mixed labels are not conflicting products.

## Application structure

```
src/
  app/                        # Angular application layer (DI world)
    app.ts, app.html, app.css # Root component: <sc-editing-scripts>, <app-cdp-page-view>, <router-outlet>
    app.config.ts             # Browser providers
    app.config.server.ts      # Server providers (provideServerRendering, provideServerLoaderRunner)
    app.routes.ts             # Catch-all + 404/500 routes; loaderResolver() wiring
    app.routes.server.ts      # ServerRoute render modes and HTTP status codes
    pages/                    # page.component.ts, not-found.component.ts, error.component.ts
    shared/layout.component.ts# headless-header / headless-main / headless-footer placeholders
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
angular.json                  # Builder, environment fileReplacements, SSR entry (src/server.ts)
```

## The two-layer split

The single most important structural fact about this app is the split between `src/app/` and `src/content-sdk/`:

| | `src/app/` | `src/content-sdk/` |
|---|---|---|
| Runs in | Angular injector | Angular SSR **and** plain Express middleware |
| Angular DI | Expected (`inject()`, providers, services) | **Not available** — must not be used |
| Contents | Components, routes, providers, layout | Loaders, `getClient()` |
| Reaches the browser | Yes | Loader bodies are invoked server-side; the browser calls `POST /_data` |

Loaders are located under `content-sdk/`, not `app/`, precisely because they must work with no Angular injector present. See [AGENTS-loaders-and-di.md](AGENTS-loaders-and-di.md).

## Generated artifacts

These are produced by tooling and should not be hand-edited:

- `.sitecore/component-map.ts` — from `src/app/components/` via `sitecore-tools project component generate-map`
- `.sitecore/sites.json`, `.sitecore/metadata.json` — via `sitecore-tools project build`
- `src/environments/environment.dev.ts`, `environment.prod.ts` — via `scripts/generate-environment.ts`
- `dist/`, `.angular/` — build output and Angular cache
