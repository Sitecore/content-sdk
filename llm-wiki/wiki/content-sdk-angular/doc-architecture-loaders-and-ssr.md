# Angular architecture — index

This hub splits the ingested **JSS-Angular Live Design** architecture PDF into focused wiki pages, each checked against **`@sitecore-content-sdk/angular`** and the **Angular template** under `packages/create-content-sdk-app/src/templates/angular/`.

**Sources:** [raw extract](../../raw/2026-05-14-jss-angular-live-design-architecture.md) · PDF in repo: [`llm-wiki/raw/design/JSS-Angular-Live-Design-Doc-140526-211917.pdf`](../../raw/design/JSS-Angular-Live-Design-Doc-140526-211917.pdf)

The Angular head fetches Sitecore layout data through a **loader system**: route `resolve` functions backed by a named loader registry, server execution with Angular's `TransferState`, and an Express RPC endpoint (`/_data`) for client navigations. Each subsection page below covers a section of this design.

## Pages (by PDF section)

| Topic | Page |
|--------|------|
| Goal, challenges, foundation | [doc-architecture-goals-challenges-and-foundation.md](doc-architecture-goals-challenges-and-foundation.md) |
| Route `resolve`, registry, `pageLoader` pattern | [doc-loaders-route-registry-and-page-loader.md](doc-loaders-route-registry-and-page-loader.md) |
| `loaderResolver`, `TransferState`, `/_data`, errors / redirects | [doc-loader-resolver-transfer-state-and-endpoint.md](doc-loader-resolver-transfer-state-and-endpoint.md) |
| `PreLoaderDataService` (parallel prefetch) | [doc-preloader-data-service.md](doc-preloader-data-service.md) |
| Loaders outside `inject()` in loader bodies | [doc-loaders-outside-angular-di.md](doc-loaders-outside-angular-di.md) |
| Env script + `defineConfig` | [doc-environment-and-define-config-angular.md](doc-environment-and-define-config-angular.md) |
| Standalone components, map, placeholders | [doc-components-and-placeholder-map.md](doc-components-and-placeholder-map.md) |
| SSR + Express middleware order | [doc-ssr-express-and-loader-middleware.md](doc-ssr-express-and-loader-middleware.md) |
| `sitecore.config.ts` | [doc-sitecore-config-typescript-angular.md](doc-sitecore-config-typescript-angular.md) |
| Field directives | [doc-field-directives.md](doc-field-directives.md) |
| Editing / page context | [doc-editing-and-page-context-angular.md](doc-editing-and-page-context-angular.md) |
| Multisite | [doc-multisite-angular-roadmap.md](doc-multisite-angular-roadmap.md) |
| Personalization | [doc-personalization-angular-roadmap.md](doc-personalization-angular-roadmap.md) |

## See also

- [index.md](index.md) — Angular wiki hub
- [Common wiki — config, env, SitecoreClient + GraphQL](../common/index.md) — **`@sitecore-content-sdk/content`** canonical pages
- [Next.js wiki](../content-sdk-nextjs/index.md)
