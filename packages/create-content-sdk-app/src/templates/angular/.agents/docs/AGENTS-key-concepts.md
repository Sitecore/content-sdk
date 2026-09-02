# Key concepts (Angular)

Optional, on-demand detail. The compact guide is [AGENTS.md](../../AGENTS.md).

## SitecoreClient

- **Where:** `src/content-sdk/client/sitecore-client.ts` exports `getClient()` — a **lazy singleton** that constructs `new SitecoreClient(scConfig)` on first use. It is lazy on purpose: build-time route extraction runs without credentials, and eager construction would throw.
- **Use for:** `getPage`, `getDictionary`, `getPreview`, `getDesignLibraryData`, `getErrorPage`, `getPagePaths`, `getSiteMap`, `getHeadLinks`.
- **Consumed by:** loaders (`getClient()` directly), `provideSitecoreAngular({ sitecoreClient: getClient() })` in `app.config.ts`, and the Express middleware in `server.ts` (sitemap, robots).
- **In components:** inject `SITECORE_CLIENT_TOKEN` (as `LayoutComponent` does for `getHeadLinks`). Do **not** call `new SitecoreClient(...)` anywhere else.

## Loaders

The Angular app has no `getStaticProps`/`getServerSideProps` equivalent. All Sitecore data enters through **loaders** — plain functions in `src/content-sdk/loaders/` attached to routes with `loaderResolver('<key>')`. Loader bodies must not use Angular DI. This is the app's central architectural rule; the full explanation, `LoaderContext` helper table, registry wiring and cache behaviour are in [AGENTS-loaders-and-di.md](AGENTS-loaders-and-di.md).

## Routing

- **Where:** `src/app/app.routes.ts` (browser + SSR route tree) and `src/app/app.routes.server.ts` (`ServerRoute` render modes and HTTP status codes).
- **Shape:** top-level `500` / `404` routes exist in both unprefixed and `:locale/`-prefixed form so `@angular/ssr` can match them and emit the right status. The Sitecore catch-all sits behind `matcher: scLocaleMatcher(scConfig.angular.locales)` with a single `path: '**'` child rendering `PageComponent` and resolving `page` + `dictionary`.
- **`scLocaleMatcher`:** consumes the first URL segment when it matches a configured locale and exposes it as the `locale` route param; otherwise it consumes nothing, so unprefixed URLs still match.
- **Do not:** add a second catch-all for Sitecore content, or change a route path without updating the matching `ServerRoute` entry.

## How locale works

- **Config:** the locale list is `angular.locales` and the fallback is `defaultLanguage`. To change either, edit **`sitecore.config.ts`** — `angular.locales` goes in the **first argument** of `defineConfig` (`defineConfig({ angular: { locales: ['en', 'fr-FR'] } }, environment)`), while `defaultLanguage` comes from env (`CSDK_PUBLIC_SITECORE_DEFAULT_LANGUAGE` / `SITECORE_DEFAULT_LANGUAGE`). `scConfig.angular.locales` and `scConfig.defaultLanguage` are the **resolved read paths** that code consumes; `defaultLanguage` is prepended to the locale list automatically, and `redirects.locales` is derived from `angular.locales`.
- **In loaders:** `getLanguage(context)` reads the `locale` route param; `splitLocaleFromPath(context.url, scConfig.angular.locales)` strips the prefix so the Sitecore item path is clean. Locale is passed to `getPage`/`getDictionary` as a separate argument — never baked into the path.
- **In the app:** `SitecoreContextService.effectiveLocale` resolves `page.locale` → URL locale → default. `LocaleUrlSerializer` (provided for `UrlSerializer`) keeps `routerLink` URLs locale-aware.
- **Do not:** assume locale from headers, or send the locale-prefixed path to `getPage`.

## Component map

- **Where:** `.sitecore/component-map.ts`, a `Map<string, AngularContentSdkComponent>` keyed by Sitecore rendering name. It always contains the built-in `['Form', ScFormComponent]` entry.
- **Generated from:** `src/app/components/` — the paths listed in `sitecore.cli.config.ts` under `componentMap.paths`. The generator scans for `@Component(` decorators. Run `npm run sitecore-tools:generate-map`; `npm run dev` watches and regenerates automatically.
- **Wired via:** `{ provide: SITECORE_COMPONENT_MAP, useValue: componentMap }` in `app.config.ts`, and imported directly in `server.ts` for `createEditingConfigMiddleware`.
- **Do not:** edit the file by hand unless the generator genuinely cannot express the case.

## Placeholders

Rendered with `<sc-placeholder [name]="'headless-main'" [rendering]="scRoute()!">` (see `src/app/shared/layout.component.ts`). The component resolves each rendering name against `SITECORE_COMPONENT_MAP` and instantiates it. Unmapped renderings fall back to `ScMissingComponentComponent`; hidden renderings to `ScHiddenRenderingComponent`. In editing mode the placeholder emits `<code class="scpm">` chrome markers and tags empty placeholders with `sc-jss-empty-placeholder`.

## Editing and preview

- **Mode:** Metadata only. There is no Experience Editor chrome support.
- **Flow:** Sitecore Pages calls `GET /api/editing/render`; `createEditingRenderMiddleware()` validates the secret, sets the CSP `frame-ancestors` header, attaches the preview payload to the same Express `req`, rewrites the URL and hands off to Angular SSR. Unlike Next.js there are no preview cookies and no internal HTTP round-trip.
- **In the loader:** `getEditingPreviewData(context.csdkRequestData)` → `getClient().getPreview(previewData)` or `getDesignLibraryData(previewData)`.
- **In the app:** `<sc-editing-scripts />` is the first element in `src/app/app.html`; it injects the Pages client scripts when `page.mode.isEditing`. `page.mode` exposes `isEditing`, `isPreview`, `isNormal`, `isDesignLibrary`.
- **Endpoints:** `/api/editing/config` (component map keys + `.sitecore/metadata.json` + `editMode: 'metadata'`), `/api/editing/experimental`, `/api/editing/render`. All must stay registered **before** the static handler and the SSR handler.
- **Cache:** disabled for editing requests.

## Environment and config

- **`sitecore.config.ts`:** `defineConfig({}, environment)` from `@sitecore-content-sdk/angular/config`. It merges explicit overrides (**first argument** — the app ships an empty `{}`), the browser-safe `CSDK_PUBLIC_*` values from `src/environments/environment.ts` (second argument), and `process.env` on the server. **This file is the only place you change Sitecore configuration.** Structural settings — `angular.locales`, `angular.loadersCache`, `angular.linkPrefetch`, `multisite`, `redirects`, `personalize` — go in the first argument; endpoints, keys and secrets stay in env. The exported `scConfig` that the rest of the app imports is the **resolved, read-only** result; never assign to it at runtime.
- **Browser env:** `scripts/generate-environment.ts` reads `.env`, `.env.local` and `.env.dev`/`.env.prod` and writes **only `CSDK_PUBLIC_*` keys** into `src/environments/environment.dev.ts` / `environment.prod.ts`. `angular.json` swaps `environment.ts` for the right one per configuration. `process.env` does not exist in the browser — this generation step is the workaround.
- **Server env:** `src/load-env.ts` (dotenv) is the first import in `src/server.ts` and `src/main.server.ts`. Secrets such as `SITECORE_EDITING_SECRET`, `SITECORE_REVALIDATE_SECRET`, `SITECORE_EDGE_CONTEXT_ID` and `SITECORE_API_KEY` stay in `process.env` and must never be given a `CSDK_PUBLIC_` name.
- **Do:** document new variables in `.env.example` with a placeholder. **Do not:** commit `.env`, or hand-edit the generated `environment.{dev,prod}.ts`.
