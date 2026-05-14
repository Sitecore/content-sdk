# Content SDK Angular wiki

**Scope:** **`@sitecore-content-sdk/angular`**, the **Angular** scaffold under **`packages/create-content-sdk-app/src/templates/angular`**, and Angular-specific **sitecore.config** / **environment** generation.

## Pages

| Page | Summary |
|------|---------|
| [doc-architecture-loaders-and-ssr.md](doc-architecture-loaders-and-ssr.md) | **Architecture index** — links to subsection pages + PDF path |
| [doc-architecture-goals-challenges-and-foundation.md](doc-architecture-goals-challenges-and-foundation.md) | Goals, bundle/env challenges, loader foundation |
| [doc-loaders-route-registry-and-page-loader.md](doc-loaders-route-registry-and-page-loader.md) | Route `resolve`, `provideLoaderRegistry`, `pageLoader` / `resolveSitecorePage` |
| [doc-loader-resolver-transfer-state-and-endpoint.md](doc-loader-resolver-transfer-state-and-endpoint.md) | `loaderResolver`, `TransferState`, `/_data`, merged params, outcomes |
| [doc-preloader-data-service.md](doc-preloader-data-service.md) | `PreLoaderDataService`, `ActivationStart`, parallel prefetch |
| [doc-loaders-outside-angular-di.md](doc-loaders-outside-angular-di.md) | Loaders in Express vs Angular — no `inject()` inside loader bodies |
| [doc-environment-and-define-config-angular.md](doc-environment-and-define-config-angular.md) | **`generate-environment`**, **`CSDK_PUBLIC_*`**, Angular **`defineConfig`**; links **common** for `buildFallbackConfig` keys |
| [doc-components-and-placeholder-map.md](doc-components-and-placeholder-map.md) | Standalone components, map generation, placeholders |
| [doc-ssr-express-and-loader-middleware.md](doc-ssr-express-and-loader-middleware.md) | Express order: `json()` → loader middleware → static → SSR |
| [doc-sitecore-config-typescript-angular.md](doc-sitecore-config-typescript-angular.md) | Root **`sitecore.config.ts`**, **`getClient()`** / **`SitecoreClient`**; links **common** for config types + GraphQL |
| [doc-field-directives.md](doc-field-directives.md) | `scText`, `scRichText`, `scImage`, `scLink`, `scRouterLink` |
| [doc-editing-and-page-context-angular.md](doc-editing-and-page-context-angular.md) | `SitecoreContextService`, `isEditing`, content `editing` re-exports |
| [doc-multisite-angular-roadmap.md](doc-multisite-angular-roadmap.md) | Multisite: PDF TBA vs `resolveSitecorePage` options + JSDoc “future” |
| [doc-personalization-angular-roadmap.md](doc-personalization-angular-roadmap.md) | Personalization: PDF TBA vs client/config reality |

## Sources

| Source | Location |
|--------|----------|
| JSS-Angular Live Design PDF (ingest 2026-05-14) | **`llm-wiki/raw/design/JSS-Angular-Live-Design-Doc-140526-211917.pdf`** |
| Text extract (same document) | `llm-wiki/raw/2026-05-14-jss-angular-live-design-architecture.md` |

## Code anchors

- `packages/angular/src/` — package implementation
- `packages/create-content-sdk-app/src/templates/angular/` — generated app template
- `packages/angular/src/config/define-config.ts` — Angular `defineConfig` wrapper
- `packages/angular/src/server/loader-data-service-middleware.ts` — loader RPC middleware

## Shared with Next.js (common wiki)

These topics are identical for Angular and Next at the **`@sitecore-content-sdk/content`** layer:

- [../common/doc-sitecore-config-input.md](../common/doc-sitecore-config-input.md) — **`SitecoreConfigInput`**, merge pipeline
- [../common/doc-config-environment-variables.md](../common/doc-config-environment-variables.md) — **`buildFallbackConfig`** env keys; Angular **`CSDK_PUBLIC_*`** vs Next **`NEXT_PUBLIC_*`**
- [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md) — **`createGraphQLClientFactory`**, **`SitecoreClient`**, **`getPage`**

## See also

- [Next.js wiki index](../content-sdk-nextjs/index.md) — parallel head patterns
- [Common wiki index](../common/index.md) — shared packages
