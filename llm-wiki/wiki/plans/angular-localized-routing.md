# Angular Localized Routing — Implementation Plan

> Branch: `feature/jss-8952-angular-i18n`
> Package: `packages/angular`
> Status: planning

## Goals

Support locale-prefixed routes in the Angular Content SDK with minimal surface change:

- Languages list is configurable in `sitecore.config` under a new `angular` section.
- When loaded at `/en/about`, all in-app links render with `/en` prefix.
- When loaded at `/about` (no prefix), links render without prefix; loaders still receive `defaultLanguage`.
- Both Angular's built-in `[routerLink]` and the SDK's `[scRouterLink]` are locale-aware.
- Error routes (`/404`, `/500`) and the catchall (`**`) are locale-aware via a shared `localeMatcher`.
- Server-side `/404` and `/500` continue to return the correct HTTP status codes (locale-prefixed variants too).
- Current locale is passed to loaders.
- Minimal change, clean code, easy maintenance.

## Decisions (confirmed)

| Decision | Choice |
|---|---|
| Plan file location | `llm-wiki/wiki/plans/` (this file) |
| Link rendering when URL has no locale prefix | No prefix added; loaders still get `defaultLanguage` |
| `redirects.locales` vs `angular.locales` | `redirects.locales` **always** mirrors `angular.locales` (the latter is the source of truth) |

---

## 1. Config: angular-specific types extending base — angular package only

`packages/content` gains **no** framework-specific additions. All Angular config manipulation stays in `packages/angular`. Both new types **extend** their content counterparts so the full type hierarchy is preserved.

### 1a. New types in `packages/angular/src/config/define-config.ts`

```ts
/**
 * Input type for Angular apps. Extends the base SitecoreConfigInput with an
 * Angular-specific section; all existing config fields are inherited unchanged.
 * @public
 */
export interface AngularSitecoreConfigInput extends SitecoreConfigInput {
  angular?: {
    /**
     * Locales supported by the Angular app.
     * `defaultLanguage` is prepended automatically if absent.
     * Mirrors to `redirects.locales` in the resolved config.
     */
    locales?: string[];
  };
}

/**
 * Resolved Angular config returned by the Angular defineConfig.
 * Extends the fully-resolved SitecoreConfig; callers that expect SitecoreConfig
 * continue to work without any changes.
 * @public
 */
export interface AngularSitecoreConfig extends SitecoreConfig {
  angular: {
    locales: string[]; // always present, never empty (contains at least defaultLanguage)
  };
}
```

Type hierarchy:

```
SitecoreConfigInput  ←extends—  AngularSitecoreConfigInput
SitecoreConfig       ←extends—  AngularSitecoreConfig
```

### 1b. Angular `defineConfig` signature

```ts
export function defineConfig(
  config: AngularSitecoreConfigInput = {},
  clientEnv: Record<string, string | undefined> = {}
): AngularSitecoreConfig
```

Implementation:

1. Call `baseDefineConfig(config, { ...clientEnv, ...getProcessEnv() })` → `SitecoreConfig`.
2. Resolve `locales`: `config.angular?.locales ?? []`.
3. Ensure `result.defaultLanguage` is in `locales` (prepend if missing; empty → `[defaultLanguage]`).
4. **Always** overwrite `result.redirects.locales` with the resolved `locales`. `angular.locales` is the single source of truth; `redirects.locales` is populated as a side-effect for the redirects proxy.
5. Return `{ ...result, angular: { locales } }` as `AngularSitecoreConfig`.
6. `AngularSitecoreConfig` and `AngularSitecoreConfigInput` should omit redirects.locales

`packages/content` is untouched.

### 1c. Token type (`packages/angular/src/lib/tokens.ts`)

`SITECORE_CONFIG_TOKEN` widens to `InjectionToken<AngularSitecoreConfig>`. Since `AngularSitecoreConfig extends SitecoreConfig`, all existing injectors that typed the token as `SitecoreConfig` remain structurally compatible. `LocaleService` and `LocaleUrlSerializer` can inject the token and access `.angular.locales` without a cast.

### 1d. `provideSitecoreAngular` (`packages/angular/src/lib/providers.ts`)

`SitecoreAngularConfig.sitecoreConfig` type updates from `SitecoreConfig` to `AngularSitecoreConfig`. Callers already pass the output of the Angular `defineConfig`, which now returns `AngularSitecoreConfig`, so no source-level change is required for users.

### 1e. Tests (`config/define-config.spec.ts`)

- empty `angular.locales` → `[defaultLanguage]`
- explicit `angular.locales` missing `defaultLanguage` → it is prepended
- `redirects.locales` always equals resolved `angular.locales`
- custom `defaultLanguage` is honored
- `AngularSitecoreConfig` is assignable to `SitecoreConfig` (structural type-check)

---

## 2. Locale extraction utility

**New file:** `packages/angular/src/i18n/locale-utils.ts`

Pure helpers — no Angular DI, easy to unit test:

```ts
export function extractLocaleFromPath(
  pathname: string,
  locales: string[]
): { locale: string | null; rest: string };

export function prependLocale(pathname: string, locale: string | null): string;
```

`prependLocale` wraps existing `getLocaleRewrite` from `@sitecore-content-sdk/content/i18n` and is a no-op when `locale` is null/empty.

---

## 3. Locale matcher (Angular `UrlMatcher`)

**Add to:** `packages/angular/src/i18n/locale-utils.ts`

```ts
export function createLocaleMatcher(locales: string[]): UrlMatcher;
```

Behavior:

- If `segments[0].path` is in `locales`: returns `{ consumed: [segments[0]], posParams: { locale: segments[0] } }`.
- Otherwise: returns `{ consumed: [], posParams: {} }` — zero-consumption match, route still matches, no `locale` param set.

**Sample usage in `app.routes.ts`:**

```ts
const errorRoutes: Route[] = [
  { path: '500', component: ErrorComponent, resolve: { page: loaderResolver('500') } },
  { path: '404', component: NotFoundComponent, resolve: { page: loaderResolver('404') } },
  { path: ':locale/500', component: ErrorComponent, resolve: { page: loaderResolver('500') } },
  { path: ':locale/404', component: NotFoundComponent, resolve: { page: loaderResolver('404') } },
];

export const routes: Routes = [
  ...errorRoutes,
  {
    matcher: createLocaleMatcher(scConfig.angular.locales),
    children: [
      {
        path: '**',
        component: PageComponent,
        resolve: { page: loaderResolver('page'), dictionary: loaderResolver('dictionary') },
      },
    ],
  },
];
```

Error routes (`404` / `500`) must live at the top level — both unprefixed and with a `:locale` parameter segment — because `@angular/ssr` validates each `ServerRoute.path` against the Angular route table by **path string** and cannot see routes nested under a `matcher`. Build fails with `The '404' server route does not match any routes defined in the Angular routing configuration` otherwise. The catchall page sits behind `createLocaleMatcher`, which still consumes a configured locale (if present) and exposes it as a `locale` route param to loaders.

The `:locale` segment matches **any** first segment, not only configured locales. For error pages this is acceptable — a request to `/zzz/404` returns a 404 status either way — but it does mean `params.locale` can carry an unconfigured value into a loader. Validating against configured locales in the loader is out of scope here.

**Tests** (`locale-utils.spec.ts`): (locale-matcher describe section)

- `/en/about` with locales `['en','de']` → consumes `en`, posParams `{ locale: 'en' }`
- `/about` → consumes nothing, no posParams
- `/fr/about` with locales `['en','de']` → consumes nothing (fr not configured)
- `/en` (locale only) → consumes `en`
- `/` → consumes nothing

---

## 4. Locale-aware link rendering — one trick for both `routerLink` and `scRouterLink`

### 4a. Custom `UrlSerializer`

**New file:** `packages/angular/src/i18n/locale-url-serializer.ts`

```ts
export class LocaleUrlSerializer extends DefaultUrlSerializer {
  serialize(tree: UrlTree): string {
    const base = super.serialize(tree);
    const locale = this.localeService.currentLocale();
    return locale ? prependLocale(base, locale) : base;
  }
  // parse() inherits — does NOT strip locale; the matcher handles it
}
```

Why this works for built-in `RouterLink` automatically — but **not** for `scRouterLink`:

- `RouterLink` computes its href as `router.serializeUrl(router.createUrlTree(commands))`. `router.serializeUrl` delegates to the DI-injected `UrlSerializer.serialize`. Replacing that binding with `LocaleUrlSerializer` makes every `RouterLink` href include the locale, with **zero changes to `RouterLink` itself**. The directive doesn't "know about" or "consume" locale — locale is injected into the output string during serialization.
- `scRouterLink` (and `ScLinkDirective` it extends) does **not** go through `router.createUrlTree` / `router.serializeUrl`. Its href is read straight from the Sitecore link field (`field.value.href`) and written to the DOM attribute. The serializer is never called for it. That is why section 4b must prepend the locale **explicitly in the directive** by reading `SitecoreContextService.currentLocale()`.
- Click navigation lines up for both: the click handlers eventually call `router.navigateByUrl(urlOrTree)`, which round-trips through `UrlSerializer.parse` / `serialize`. Once the href is correct, browser-URL update and matcher re-extraction stay consistent.

Summary of the asymmetry:

| Directive | href source | Locale injection point |
|---|---|---|
| `[routerLink]` (built-in) | `router.serializeUrl(createUrlTree(commands))` | `LocaleUrlSerializer.serialize` (DI override — directive untouched) |
| `[scRouterLink]` / `[scLink]` (SDK) | Sitecore field `value.href` written directly to DOM | `ScLinkDirective` reads `SitecoreContextService.currentLocale()` and calls `prependLocale` |

### 4b. `ScLinkDirective` enhancement

**Edit:** `packages/angular/src/field-directives/sc-link.directive.ts`

When building the `href` attribute from a Sitecore link field, run this decision tree:

1. If the href is **external** (http://, https://, mailto:, tel:, sms:, ftp:, data:, javascript:, `//`) → write as-is. Skip.
2. If the href is a **fragment-only or empty** (`""`, `"#"`, `"#section"`) → write as-is. Skip.
3. If the href is internal (starts with `/`), extract its first segment:
   - **First segment IS a configured locale** (i.e. `locales.includes(seg)`) → the layout data already carries a locale prefix. Write the href as-is; do **not** alter it. This respects authored cross-locale links (e.g. a `/de/about` link rendered on an English page goes to German, by author intent) and is idempotent against repeated processing.
   - **First segment is NOT a configured locale** → call `prependLocale(href, currentLocale)`. When `currentLocale` is `null`, `prependLocale` is a no-op (so unprefixed pages keep unprefixed links).

`ScRouterLinkDirective` extends `ScLinkDirective`, so it inherits this behavior automatically.

#### Why "respect CMS-provided locale" rather than "rewrite to current"

The alternative — stripping the CMS-provided locale and re-prepending the current locale — would break two real scenarios:

- **Cross-locale links authored in Sitecore** (an English page that intentionally links to the German privacy notice). Rewriting destroys author intent.
- **Round-tripping**: a link rendered once already with locale prefix would get re-prefixed on subsequent change-detection passes if the rule didn't recognize the existing prefix. The "leave alone if already prefixed" rule is naturally idempotent.

If a future requirement says "always normalize CMS hrefs to current locale", it becomes a separate, opt-in policy — not the default.

#### `extractLocaleFromPath` reuse

The same `extractLocaleFromPath(href, locales)` helper from section 2 is used here. The directive holds a reference to `sitecoreConfig.angular.locales` (via the config token already injected for other purposes) and the current locale via `SitecoreContextService`.

### 4c. Parity requirement (verified by tests)

Because the two directives use different mechanisms — Angular's `[routerLink]` goes through `LocaleUrlSerializer`, and `[scRouterLink]` goes through `ScLinkDirective` reading `SitecoreContextService` — they could drift. The locale-url-serializer spec includes a TestBed scenario that mounts both directives in one fixture, sets `currentLocale` to the same value, and asserts both `<a>` tags render identical href values for the same logical destination.

Required parity points:

- Same logical href + same `currentLocale='en'` → both render `/en/about`.
- Same logical href + `currentLocale=null` → both render `/about`.
- Idempotency: layout-data href already containing a locale (`/en/about`) renders `/en/about` once, not `/en/en/about` after subsequent change-detection cycles. The `LocaleUrlSerializer` path is naturally idempotent (routerLink commands rarely embed a locale, and the serializer prepends from current state, not from input). The `ScLinkDirective` path enforces idempotency via the "first segment already a configured locale → leave alone" rule (4b).

### Behavior matrix

| Loaded URL | `currentLocale` | `effectiveLocale` (for loaders) | `[routerLink]="/foo"` href | `[scRouterLink]` (field href `/foo`) |
|---|---|---|---|---|
| `/en/about` | `en` | `en` | `/en/foo` | `/en/foo` |
| `/about` | `null` | `defaultLanguage` | `/foo` | `/foo` |
| `/de/about` | `de` | `de` | `/de/foo` | `/de/foo` |

---

## 5. Current-locale state — extend `SitecoreContextService` (no new service)

`SitecoreContextService` already holds request-scoped state (`page`, `dictionary`, `isEditing`) with the right lifecycle and consumers. Add locale to it rather than introducing a parallel service.

**Edit:** `packages/angular/src/lib/sitecore-context.service.ts`

Add two readonly signals and one setter:

```ts
/** Locale extracted from the current URL; null when the URL has no locale prefix. */
readonly urlLocale: Signal<string | null>;

/** Effective locale for data fetching: currentLocale ?? defaultLanguage. */
readonly effectiveLocale: Signal<string>;

/** Update the current URL locale. Called from navigation hooks. @internal */
setLocale(locale: string | null): void;
```

`effectiveLocale` is `computed(() => this.urlLocale() ?? this.defaultLanguage)`. `defaultLanguage` comes from `SITECORE_CONFIG_TOKEN`, which `SitecoreContextService` will inject in its constructor.

### 5a. Initialization & updates

A new module-level setup function registered by `provideSitecoreAngular` (no separate service class needed):

**New file:** `packages/angular/src/i18n/locale-bootstrap.ts`

Exports a factory provider that uses `APP_INITIALIZER` (or `provideAppInitializer` in modern Angular) to:

1. Resolve initial locale once:
   - SSR: `inject(REQUEST, { optional: true })?.url`
   - Browser: `window.location.pathname`
   - Pass through `extractLocaleFromPath(path, sitecoreConfig.angular.locales)` and call `context.setLocale(locale)`.
2. Subscribe to `Router.events` (`NavigationEnd`) and re-extract from `event.urlAfterRedirects` → `context.setLocale(locale)`.

This setup is wired automatically by `provideSitecoreAngular` when `sitecoreConfig.angular.locales.length > 0`.

### 5b. Consumers

- `LocaleUrlSerializer.serialize()` reads `context.currentLocale()`.
- `ScLinkDirective` reads `context.currentLocale()` when building internal hrefs.
- Loaders that need locale read it from `ctx.params['locale']` (populated by the matcher + defaulted to `defaultLanguage` by `loaderResolver`).

---

## 6. Loaders receive current locale

The matcher writes `locale` into route params; `loaderResolver` already passes `route.params` (merged from `pathFromRoot`) into `LoaderContext.params`. Two small adjustments:

**Edit:** `packages/angular/src/loaders/loader-resolver.ts`

- After collecting `allParams`, default `params.locale` from `SITECORE_CONFIG_TOKEN.defaultLanguage` when missing.
- The token is already injected elsewhere in the SDK; no new wiring required.

**Edit:** `packages/angular/src/loaders/models.ts` (docs only)

- Add JSDoc note on `LoaderContext.params` mentioning the conventional `locale` key.

Loaders then read `ctx.params['locale']` and always see a concrete value.

---

## 7. Server routes — preserve 404 / 500 statuses

`@angular/ssr` `ServerRoute.path` does not support optional segments, but it **does** support `:param` syntax. We use a `:locale` parameter segment so any locale prefix matches the same `ServerRoute` entry without enumerating configured locales.

The Angular route table must mirror these paths string-for-string (see section 3) — `@angular/ssr` validates each `ServerRoute.path` against the router config by path; routes nested under a `matcher` are invisible to that check. The error routes therefore live at the top level of `app.routes.ts`, not inside the locale matcher.

The SDK does **not** ship a helper for this — the table is only 5 entries and lives in the sample app directly so it stays visible.

**Sample `app.routes.server.ts`:**

```ts
import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '404', renderMode: RenderMode.Server, status: 404 },
  { path: '500', renderMode: RenderMode.Server, status: 500 },
  { path: ':locale/404', renderMode: RenderMode.Server, status: 404 },
  { path: ':locale/500', renderMode: RenderMode.Server, status: 500 },
  { path: '**', renderMode: RenderMode.Server },
];
```

Cost: a fixed 5-entry table, independent of locale count.

---

## 8. Wire-up via `provideSitecoreAngular`

**Edit:** `packages/angular/src/lib/providers.ts`

- `SitecoreAngularConfig` interface unchanged externally.
- When `sitecoreConfig.angular.locales.length > 0`, push:
  - `{ provide: UrlSerializer, useClass: LocaleUrlSerializer }`

Routes-level wiring (the matcher) is opt-in at the app level — the user writes `createLocaleMatcher(scConfig.angular.locales)` in `app.routes.ts`. The SDK does not own route shape.

---

## 9. Public API additions

**Edit:** `packages/angular/src/public-api.ts`

Export:

- `createLocaleMatcher`
- `LocaleUrlSerializer`
- `extractLocaleFromPath`
- `prependLocale`
- `AngularSitecoreConfigInput`, `AngularSitecoreConfig` (types)

`SitecoreContextService` is already exported; its public surface grows by `currentLocale`, `effectiveLocale`, and `setLocale` — run `yarn api-extractor:verify` to refresh the report.

Run `yarn api-extractor:verify` to refresh the API surface report after changes.

---

## 10. Tests

*All new tests* should use descriptions that map or closely match real human use cases in the format of "should xyz". I.e. define-config.spec.ts should contain `should apply angular locales to redirect locales settings`, `should override redirect locale settings with angular settings`

| File | Coverage |
|---|---|
| `config/define-config.spec.ts` (extend) | locales merging, defaultLanguage inclusion, redirects mirroring |
| `i18n/locale-utils.spec.ts` (new) | `extractLocaleFromPath`, `prependLocale` | `locale-matcher` matcher with/without prefix, unknown locale, root, locale-only path
| `i18n/locale-url-serializer.spec.ts` (new) | **Unit**: `LocaleUrlSerializer.serialize` with/without current locale; root URL handling; query/fragment preservation. **Integration A (built-in `[routerLink]`)**: TestBed with `LocaleUrlSerializer` registered and a stub `SitecoreContextService` (`currentLocale` returns `'en'` / `null`). Render a component with `<a [routerLink]="['/about']">`, assert the resulting `href` attribute is `/en/about` when locale is `en` and `/about` when locale is `null`. Trigger click → assert `router.navigateByUrl` is called and the parsed URL still matches the configured matcher. **Integration B (cross-check with `[scRouterLink]`)**: same TestBed setup but render an anchor with `[scRouterLink]` bound to a Sitecore link field whose `href` is `/about`; assert it independently produces `/en/about`. The two paths use different mechanisms (serializer vs. directive reading context) but must agree on the final href for the same logical link. |
| `lib/sitecore-context.service.spec.ts` (extend) | `currentLocale` / `effectiveLocale` signals; `setLocale` updates |
| `i18n/locale-bootstrap.spec.ts` (new) | initial extraction from `REQUEST` and `window.location`; `NavigationEnd` updates context |
| `field-directives/sc-link.directive.spec.ts` (extend) | href processing matrix (with locales `['en','de']`): (1) field href `/about`, locale `en` → `/en/about`; (2) field href `/about`, locale `null` → `/about`; (3) field href `/en/about`, locale `en` → `/en/about` (already prefixed, not double-prefixed); (4) field href `/de/about`, locale `en` → `/de/about` (cross-locale authored link preserved); (5) field href `/about`, locale `de` → `/de/about`; (6) external href `https://example.com/en/foo` → untouched; (7) `mailto:`, `tel:`, `//cdn...` → untouched; (8) `#section`, `""` → untouched; (9) idempotency: running the directive twice on the same field never produces `/en/en/about`. Mirrors Integration B in the serializer spec to keep the two directives in sync. |
| `loaders/loader-resolver.spec.ts` (extend) | `params.locale` populated from matcher; fallback to `defaultLanguage` |

---

## File changes summary

### New files

```
packages/angular/src/i18n/locale-utils.ts
packages/angular/src/i18n/locale-url-serializer.ts
packages/angular/src/i18n/locale-bootstrap.ts
```

### Edited files

```
packages/angular/src/config/define-config.ts     (AngularSitecoreConfigInput/Config types + locales merge + redirects mirror)
packages/angular/src/lib/tokens.ts               (SITECORE_CONFIG_TOKEN widens to AngularSitecoreConfig)
packages/angular/src/lib/providers.ts            (sitecoreConfig type → AngularSitecoreConfig; UrlSerializer override + locale bootstrap when locales configured)
packages/angular/src/lib/sitecore-context.service.ts  (+ currentLocale/effectiveLocale signals + setLocale)
packages/angular/src/field-directives/sc-link.directive.ts  (+ locale-aware internal href)
packages/angular/src/loaders/loader-resolver.ts  (+ locale fallback into params)
packages/angular/src/loaders/models.ts           (JSDoc note on params.locale)
packages/angular/src/public-api.ts               (+ new exports)
samples/angular-csdk/src/app/app.routes.ts       (top-level error routes + createLocaleMatcher for catchall)
samples/angular-csdk/src/app/app.routes.server.ts (inline server-route table with :locale param)
samples/angular-csdk/sitecore.config.ts          (+ angular.locales)
```

---

## Tradeoffs / known caveats

1. **`UrlSerializer` override is global.** Any consumer (3rd-party or internal) calling `UrlSerializer.serialize()` gets locale-prefixed strings. That's the desired behavior, but worth flagging.
2. **`parse()` does not strip.** The matcher must always be present in the route tree when locales are configured; otherwise `/en/about` will not match any route. The SDK does not enforce this — it's part of the documented integration step.
3. **Server-route table is fixed at 5 entries.** Uses a `:locale` parameter segment instead of per-locale expansion, so any first segment (configured locale or not) is treated as a locale for `/x/404` and `/x/500` URLs. Acceptable for error pages where only the status code matters.
4. **`currentLocale` is `null`, not `defaultLanguage`, when no prefix is in the URL.** This is intentional so unprefixed pages keep unprefixed links. Loaders use `effectiveLocale` (`currentLocale ?? defaultLanguage`) for data fetching.
5. **Hash navigation / fragment-only links** (`href="#section"`) — `ScLinkDirective` should skip prefixing these; verify in tests.

---

## Out of scope (follow-ups)

- Locale switcher UI / utility helper (`switchLocale(targetLocale)` would parse current URL, swap the locale segment, navigate).
- Default-locale-without-prefix policy (e.g. always strip `/en` from URLs when `en` is the default). Current plan leaves whatever the URL contains intact.
- Cookie/Accept-Language locale negotiation for prefix-less initial requests — Angular SSR can be configured at the app level; SDK doesn't impose a policy.
