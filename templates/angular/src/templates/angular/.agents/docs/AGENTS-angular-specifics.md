# Angular specifics

Optional, on-demand detail. The compact guide is [AGENTS.md](../../AGENTS.md).

## Routing and data fetching

- **Root component:** `src/app/app.ts` with template `src/app/app.html` — `<sc-editing-scripts />`, `<app-cdp-page-view />`, `<router-outlet />`. Do not fetch Sitecore data here.
- **Single page for Sitecore content:** the `path: '**'` route inside the `scLocaleMatcher` block renders `PageComponent` and resolves `{ page: loaderResolver('page'), dictionary: loaderResolver('dictionary') }`.
- **Error routes:** `404` and `500` exist at the top level in unprefixed and `:locale/`-prefixed form, plus inside the matcher block. Each resolves its own loader (`loaderResolver('404')` / `loaderResolver('500')`), which calls `getClient().getErrorPage(...)`.
- **Server routes:** `src/app/app.routes.server.ts` maps the same paths to `RenderMode.Server` and sets `status: 404` / `status: 500`. Adding or renaming a route means updating this file too, or the response status will be wrong.
- **Data flow:** all Sitecore data enters via loaders, never via `HttpClient` in a component. `PageComponent` reads `toSignal(route.data)` and passes `page` into `<app-layout [page]="pageValue">`.
- **Navigation errors:** `provideRouter(routes, withNavigationErrorHandler(handleNavigationError()))` turns `NotFoundNavigationError` / `LoaderHttpError` into navigation to `notFoundRoute` / `errorRoute`, configured in `provideSitecoreAngular()`.

## Providers

`src/app/app.config.ts`:

- `provideBrowserGlobalErrorListeners()`, `provideHttpClient(withFetch())`
- `provideRouter(routes, withNavigationErrorHandler(handleNavigationError()))`
- `provideSitecoreAngular({ notFoundRoute: '/404', errorRoute: '/500', sitecoreConfig: scConfig, sitecoreClient: getClient() })`
- `provideLoaderRegistry(LOADERS)` and `ClientPreLoaderDataService`
- `{ provide: SITECORE_COMPONENT_MAP, useValue: componentMap }`
- `provideTranslateService({ loader: provideTranslateLoader(SitecoreTranslateLoader) })`
- `{ provide: UrlSerializer, useClass: LocaleUrlSerializer }`

**`provideClientHydration()` is deliberately absent.** The file documents why: with hydration the server-rendered DOM is reused and directive listeners (notably `RouterLink` clicks) can fail to attach. Do not add it without an explicit request and a plan to verify routing.

`src/app/app.config.server.ts` adds `provideServerRendering(withRoutes(serverRoutes))` and `provideServerLoaderRunner()`. Without `provideServerLoaderRunner()` the SSR branch of `loaderResolver` throws.

## Express server and middleware order

`src/server.ts` builds the Express app. The order is load-bearing — do not reshuffle it:

1. `express.json()` — must precede the `/_data` POST handler
2. `createSitecoreRevalidateMiddleware({ cache, defaultLocale, sites })` — `POST /api/revalidate`
3. `createSitemapMiddleware({ client, sites })` — `/sitemap.xml`, `/sitemap-:id.xml`
4. `createRobotsMiddleware({ client, sites })` — `/robots.txt`
5. `createEditingConfigMiddleware({ components, metadataImport })` — `/api/editing/config`
6. `createExperimentalFeaturesMiddleware()` — `/api/editing/experimental`
7. `createEditingRenderMiddleware()` — `/api/editing/render`
8. `createMultisiteMiddleware(...)` — resolves the site onto `req.scParams`
9. `createBotTrackingMiddleware(...)` — sets the `sc_bot` cookie **before** personalize decides to skip
10. `createRedirectsMiddleware(...)` — short-circuits before any CDP call
11. `createPersonalizeMiddleware(...)` — reads the site resolved in step 8
12. `createLoaderDataServiceMiddleware(config, { loaders: LOADERS, cache })` — `POST /_data`
13. `express.static(browserDistFolder, ...)`
14. `angularApp.handle(req, { cache: loaderCache, req, res })` — SSR

Why it matters: multisite must precede personalize (personalize reads the resolved site); bot tracking must precede personalize (the cookie gates the skip); redirects must precede personalize (avoid a wasted CDP call); editing endpoints must precede static and SSR; `/_data` must precede the SSR catch-all handler.

**Shared matcher:** steps 8–11 share `middlewareMatcher` (`excludePaths: ['/healthz', '/metrics', /\.[^/]+$/]`). The SDK already skips `/api/*`, `/sitecore/*`, files with extensions, and editing/preview requests — only add app-specific routes here.

**Request context:** `angularApp.handle(req, { cache, req, res })` puts the loader cache and the Node `req`/`res` on `REQUEST_CONTEXT`, which the SSR loader resolver and the server analytics provider both read.

## Components

- **Standalone only.** No `NgModule` feature pattern.
- **Location:** `src/app/components/` (the path listed in `sitecore.cli.config.ts`). `*.spec.ts` is excluded from map generation.
- **Contract:** accept `fields`, `params`, and `rendering` via Angular `input()`, and add `export default` alongside the named class export — the generated map spreads the module (`{ ...ModuleImport }`) so both default and named variant exports are picked up.
- **Selector prefix:** `app`, kebab-case (enforced by `eslint.config.mjs`).
- **Reference:** `src/app/components/partial-design-dynamic-placeholder.component.ts`.

## Field directives

Fields are rendered with **structural directives**, applied to a host element you supply. There are no `<sc-text>`-style element components.

| Directive | Host | Usage |
|-----------|------|-------|
| `*scText` | any element | `<h1 *scText="fields().Title"></h1>` — HTML-encoded via `textContent` |
| `*scRichText` | any element | Rich HTML via `innerHTML`, with internal link interception |
| `*scImage` | `<img>` | Sets `src`, `alt` and dimensions from an `ImageField` |
| `*scLink` | `<a>` | Anchor from a `LinkField`; locale-aware |
| `*scRouterLink` | `<a>` | Sitecore link resolution over Angular `RouterLink`; locale-aware |

- Validate the field exists before rendering.
- In editing mode these directives emit the `<code class="scpm">` metadata markers Pages needs — bypassing them breaks editing.
- **Security:** `scTextEncode="false"` assigns `innerHTML` and `*scRichText` intentionally bypasses strict sanitization. Use them only for content authored in the CMS, and rely on CSP.
- `eslint.config.mjs` disables `@angular-eslint/template/elements-content` because these directives populate host element content at runtime.

## i18n and dictionary

- **URL model:** `/{locale}/{path}`, e.g. `/en/about`, `/fr-FR/about`. `scLocaleMatcher(scConfig.angular.locales)` consumes the segment when present; unprefixed URLs fall back to `scConfig.defaultLanguage`.
- **Adding a locale:** edit `sitecore.config.ts` and pass it in the **first argument** of `defineConfig` — `defineConfig({ angular: { locales: ['en', 'fr-FR'] } }, environment)`. `defaultLanguage` is prepended automatically when missing, and `redirects.locales` is derived from `angular.locales`, so `angular.locales` is the single source of truth. `scConfig.angular.locales` is the resolved read path used by the router and loaders — do not assign to it.
- **In loaders:** `getLanguage(context)` for the locale, `splitLocaleFromPath(context.url, scConfig.angular.locales).nonLocalePath` for the Sitecore item path.
- **Dictionary:** `dictionaryLoader` calls `getClient().getDictionary({ locale, site })`; the result lands in route data as `dictionary` and in `SitecoreContextService.dictionary()`.
- **Translation:** `SitecoreTranslateLoader` bridges the dictionary into `@ngx-translate/core`; the root component calls `translate.use(lang)` when `page.locale` changes. Page content itself comes from Sitecore language versions — do not add a second translation source for it.
- **Links:** `LocaleUrlSerializer` and the `*scLink` / `*scRouterLink` directives prepend the current locale; do not build locale prefixes by hand.

## Multisite

- `createMultisiteMiddleware({ ...config.multisite, sites, defaultSite, matcher })` resolves the site per request in this order: `sc_site` query parameter → `sc_site` cookie → hostname → `defaultSite`. The result is written to `req.scParams.siteName` and becomes part of the loader cache key.
- Loaders read it with `getSiteName(context)`. Never hardcode a site name in a loader or a link.
- The site list comes from `.sitecore/sites.json`, generated by `generateSites()` during `sitecore-tools project build`. Do not hardcode it.
- Multisite settings live in `sitecore.config.ts`, in the first argument of `defineConfig`: `defineConfig({ multisite: { enabled: true, useCookieResolution: (req) => … } }, environment)`. With `multisite.enabled: false`, every request uses `defaultSite`.
- Cross-origin setups may not send the `sc_site` cookie — use `?sc_site=` or `SameSite=None; Secure`.

## Personalization and analytics

- **Personalization:** `createPersonalizeMiddleware(...)` calls Sitecore CDP and writes `variantId` / `componentVariantIds` onto `req.scParams`; `pageLoader` forwards them to `getPage(..., { personalize: { … } })`. It skips `/api/*`, editing and preview, bots, and prefetch requests (`x-sc-purpose: prefetch`) — a prefetch must never fire a CDP exposure event. A CDP timeout falls back to the default variant rather than blocking the render. Requires Edge configuration (`contextId` / `clientContextId`) and does not work against local containers. Personalized responses are sent with `Cache-Control: private, no-store` so CDNs never cache one visitor's variant. Browser-side CDP event tracking is not implemented.
- **Analytics:** inject the `SITECORE_ANALYTICS` token (`pageView`, `event`, `identity`, `form`). `src/app/components/content-sdk/cdp-page-view.component.ts` is the reference consumer — it fires `pageView` on navigation only when `page.mode.isNormal`. The browser implementation is disabled in `isDevMode()` and when `api.edge.clientContextId` is missing; the server implementation needs `req`/`res` on `REQUEST_CONTEXT`.
- **Bot tracking:** `createBotTrackingMiddleware(...)` sets the `sc_bot` cookie and emits a dedicated bot page-view; it does not run on localhost/dev.

## Caching and revalidation

Angular has no framework ISR. This app caches **loader results** instead:

- `createLoaderCache({ revalidate, enabled, defaultSiteName, driver })` in `src/server.ts`, backed by `unstorage` (memory driver by default; a filesystem driver is shown in the comments).
- Configured by editing `sitecore.config.ts` — `defineConfig({ angular: { loadersCache: { enabled: true, revalidate: 300 } } }, environment)`. Both fields default when omitted (`enabled: true`, `revalidate: 300`). `scConfig.angular.loadersCache` is the resolved read path consumed by `src/server.ts`. Per-route overrides go on the resolver: `loaderResolver('page', { enabled, revalidate, tags })`.
- Stale-while-revalidate semantics; keys include site, locale and personalization variant.
- `POST /api/revalidate` (`createSitecoreRevalidateMiddleware`) invalidates entries; guard it with `SITECORE_REVALIDATE_SECRET`.
- In production use a driver backed by shared storage — a per-process memory map will not be consistent across workers.
- The cache is **server-only** and must never appear in the browser bundle.

## Config files

- **`sitecore.config.ts`** — `defineConfig({}, environment)` from `@sitecore-content-sdk/angular/config`. **The only place Sitecore configuration is changed.** Structural overrides go in the **first argument** (the app ships an empty `{}`); Angular-specific keys there are `angular.locales`, `angular.loadersCache`, `angular.linkPrefetch`. The second argument carries browser-safe `CSDK_PUBLIC_*` values from `environment*.ts`; server values come from `process.env`. No hardcoded secrets, endpoints, or keys. Everything the app imports as `scConfig` is the resolved, read-only output.
- **`sitecore.cli.config.ts`** — `defineCliConfig({ config, build: { commands: [generateMetadata(), generateSites()] }, componentMap: { paths: ['src/app/components'], exclude: ['**/*.spec.ts'] } })`. Node/build-time only; it is not in the Angular compiler `include` set.
- **`angular.json`** — `@angular/build:application` builder, `outputMode: "server"`, SSR entry `src/server.ts`, environment `fileReplacements` per configuration, and `allowedCommonJsDependencies`. Lint covers `src/**/*.ts`, `src/**/*.html` and `sitecore.config.ts`.
- **`tsconfig.json`** — path aliases `client/*`, `components/*`, `lib/*`, `.sitecore/*`; includes `sitecore.config.ts`, `sitecore.cli.config.ts` and `.sitecore/**/*.ts`.

## Differences from the Next.js templates

Useful when porting guidance or code from a Next.js head app:

| Topic | Angular | Next.js |
|-------|---------|---------|
| Data fetching | Loaders + `loaderResolver` + `TransferState` + `POST /_data` | `getStaticProps` / `getServerSideProps` |
| Request middleware | Express middleware in `src/server.ts` | Edge middleware chain in `proxy.ts` |
| Browser env prefix | `CSDK_PUBLIC_*` baked into generated `environment*.ts` | `NEXT_PUBLIC_*` inlined at build |
| Caching | Loader cache + unstorage + SWR + `/api/revalidate` | Framework ISR / OSR |
| Editing transport | Payload on the same Express `req` | Preview cookies + internal fetch |
| Component map | `SITECORE_COMPONENT_MAP` injection token | Props / `SitecoreProvider` |
| Field rendering | Structural directives (`*scText`) | Components (`<Text>`) |
| Locale | URL segment + `scLocaleMatcher` | `context.locale` from Next.js i18n |
