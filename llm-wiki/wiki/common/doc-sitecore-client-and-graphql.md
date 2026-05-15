# `SitecoreClient` and GraphQL (content package)

**Mental model:** Experience Edge (or local GraphQL) returns **JSON** layout/dictionary data. The head’s **`sitecore.config.ts`**, merged via **`defineConfig`** ([doc-sitecore-config-input.md](doc-sitecore-config-input.md)) and env ([doc-config-environment-variables.md](doc-config-environment-variables.md)), drives **`createGraphQLClientFactory`** and **`SitecoreClient`**. This path is the same for **Next**, **Angular**, and any app using **`@sitecore-content-sdk/content`**.

**Packages:** `@sitecore-content-sdk/core` (HTTP GraphQL client, retry), `@sitecore-content-sdk/content` (`SitecoreClient`, layout/dictionary/editing services).

## GraphQL client factory

**Source:** `packages/content/src/client/utils.ts` — **`createGraphQLClientFactory`**.

`GraphQLClientOptions` = `Pick<SitecoreConfigInput, 'api'>` + optional **`FetchOptions`**.

### Branching (resolved endpoint)

| Condition | Result |
|-----------|--------|
| `api.edge.contextId` (server) | Edge endpoint from **`getEdgeProxyContentUrl(edgeUrl)`** + server `contextId` |
| Browser + `api.edge.clientContextId` | Same Edge base + **client** `contextId` |
| `api.local.apiKey` && `api.local.apiHost` | `` `${apiHost}${path}` `` + API key header |
| Browser, none of the above | Warn; dummy endpoint `/api/graphql` |
| Server, none | **Throw** (misconfiguration) |

### Edge content URL

`packages/content/src/client/edge-proxy.ts` — **`getEdgeProxyContentUrl`** appends **`/v1/content/api/graphql/v1`** to the normalized Edge base (not the bare `edgeUrl` root alone).

### Local URL

`` `${local.apiHost}${local.path}` ``; default **`path`** from **`buildFallbackConfig`**: **`/sitecore/api/graph/edge`**.

### Head-specific consumers

- **Any head:** **`SitecoreClient`** constructor uses the factory from merged **`api`** + **`retries`**.
- **Next.js only:** dev **proxy** (`packages/nextjs/src/proxy/proxy.ts`) — see [../content-sdk-nextjs/doc-sitecore-config.md](../content-sdk-nextjs/doc-sitecore-config.md).

## `SitecoreClient` role

Framework-agnostic client: layout pages, dictionary, preview/editing, error pages, sitemap (**XML** string), robots, **`getData`** (raw GraphQL).

**Implementation:** `packages/content/src/client/sitecore-client.ts`.

### Construction

- **`createGraphQLClientFactory`** from init **`api`** + retries — table above.
- Services: **`layoutService`** (**`LayoutService`** in **`packages/content/src/layout/`**), **`dictionaryService`**, **`editingService`**, **`errorPagesService`**, **`sitePathService`**, **`componentService`**. Overridable via **`SitecoreClientInit.custom`**.
- **`getPage`** → **`layoutService.fetchLayoutData`** → personalization hooks / **`applyContentRewrite`** → **`Page`**.

### `BaseSitecoreClient` methods

| Method | Role |
|--------|------|
| `getData` | Raw GraphQL |
| `getPage` | Route layout + metadata |
| `getDictionary` | Dictionary phrases |
| `getPreview` | Preview / editing layout via **`EditingService`** |
| `getDesignLibraryData` | Design library |
| `getErrorPages` / `getErrorPage` | Error content |
| `getPagePaths` | SSG paths |
| `getHeadLinks` | Styles / theme links |
| `getSiteMap` | Sitemap XML string |
| `getRobots` | robots.txt |

## `Page` type contract

`SitecoreClient.getPage` returns **`Page | null`** (`packages/content/src/client/sitecore-client.ts`).

| Field | Type | Notes |
|-------|------|-------|
| `layout` | `LayoutServiceData` | Contains `layout.sitecore.route: RouteData \| null` — route fields and placeholder tree |
| `siteName` | `string?` | Resolved site name |
| `locale` | `string` | Active locale/language for this page |
| `mode` | `PageMode` | See flags below |

**`PageMode` flags:**

| Flag | Meaning |
|------|---------|
| `mode.isEditing` | Page is open in the Sitecore Pages editor |
| `mode.isPreview` | Preview mode |
| `mode.isNormal` | Normal rendering (not editing, not preview) |
| `mode.isDesignLibrary` | Design Library rendering |

## Editing utilities (`content/editing`)

`@sitecore-content-sdk/content/editing` exports two framework-agnostic helpers used by both Angular and Next.js:

| Export | Purpose |
|--------|---------|
| `isEditorActive()` | Returns `true` when the page is loaded inside the Sitecore Pages editor (checks window/DOM signals) |
| `resetEditorChromes()` | Re-initializes the editor chrome decorators after client-side navigation or dynamic content changes |

Both heads re-export these from their own packages. In Angular they appear in `SitecoreContextService`'s editing integration; in Next.js the React `Placeholder` calls `PagesEditor.resetChromes()` (same concept, reached through `@sitecore-content-sdk/react` re-export).

**Source:** `packages/content/src/editing/utils.ts`

## Head-specific usage

- **Angular:** `getClient()` singleton, `resolveSitecorePage` — see [doc-sitecore-config-typescript-angular.md](../content-sdk-angular/doc-sitecore-config-typescript-angular.md).
- **Next.js:** `SitecoreNextjsClient` extensions — see [doc-sitecore-client-apis.md](../content-sdk-nextjs/doc-sitecore-client-apis.md).

## Related

- [doc-sitecore-config-input.md](doc-sitecore-config-input.md)
- [../content-sdk-nextjs/doc-architecture-edge-graphql.md](../content-sdk-nextjs/doc-architecture-edge-graphql.md) — official doc alignment + `package.json` note

## Raw

- `llm-wiki/raw/2026-05-14-content-sdk-services-and-apis.md` (Services and APIs ingest)
