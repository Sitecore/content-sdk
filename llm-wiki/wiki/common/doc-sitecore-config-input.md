# `SitecoreConfigInput` and `sitecore.config.ts` (content package)

Framework-agnostic configuration consumed by **`@sitecore-content-sdk/content`** (`defineConfig`, `SitecoreClient`, GraphQL factory). Next.js and Angular add thin **`defineConfig`** wrappers that supply environment maps before calling this layer.

**Code:** `packages/content/src/config/models.ts` (types), `packages/content/src/config/define-config.ts` (merge + validation).

## Where `sitecore.config.ts` lives

- Generated apps: root **`sitecore.config.ts`** (any head).
- Monorepo templates: Next (Pages / App Router), Angular under `packages/create-content-sdk-app/src/templates/*/`.

## Merge pipeline (content `defineConfig`)

1. **`buildFallbackConfig(env)`** fills gaps from process-backed env keys (see [doc-config-environment-variables.md](doc-config-environment-variables.md)).
2. **`resolveConfig`** **`deepMerge`** — skips **`undefined`** and empty string **`''`** overrides so env can intentionally clear some paths.
3. **`resolveEdgeUrl`** normalizes merged **`api.edge.edgeUrl`**.
4. **CLI mode** (`SITECORE_CLI_MODE=true`): lazy validation **Proxy** on sensitive paths; otherwise **`validateApiConfiguration`** runs immediately (server must have Edge **`contextId`** or local **`apiHost`** + **`apiKey`**).

## `SitecoreConfig` shape

Runtime type is **`SitecoreConfig`** = **`DeepRequired<SitecoreConfigInput>`**.

### Top-level keys

| Key | Type | Purpose |
|-----|------|---------|
| `api` | optional object | **`edge`** and/or **`local`**; runtime choice in **`createGraphQLClientFactory`**. |
| `defaultLanguage` | `string?` | Fallback locale. |
| `defaultSite` | `string?` | Fallback site name. |
| `editingSecret` | `string?` | Editing / preview route auth. |
| `retries` | object? | `count`, `retryStrategy` (**`RetryStrategy`**). |
| `layout` | object? | `formatLayoutQuery` hook. |
| `dictionary` | object? | `caching.enabled`, `caching.timeout` (seconds). |
| `multisite` | object? | `enabled`, `useCookieResolution(req?,res?) => boolean`. |
| `personalize` | object? | `enabled`, `edgeTimeout`, `cdpTimeout`, `scope`, `channel`, `currency`. |
| `redirects` | object? | `enabled`, `locales` — **redirect maps only** (not redirect items). |
| `rewriteMediaUrls` | `boolean \| ((v: string) => string)?` | Media/content URL rewrite in layout JSON (`SitecoreClient.applyContentRewrite`). |
| `disableCodeGeneration` | `boolean?` | Opt out of code-generation tooling. |

### `api.edge` / `api.local`

See **`SitecoreConfigInput`** JSDoc in **`models.ts`**: Edge **`contextId`**, **`clientContextId`**, **`edgeUrl`** vs local **`apiKey`**, **`apiHost`**, **`path`**.

### `SitecoreCliConfigInput` (separate `sitecore.cli.config`)

Holds **`config: SitecoreConfig`**, optional **`build.commands`**, **`scaffold.templates`** (`ScaffoldTemplate[]`), **`componentMap`** (`GenerateMapArgs` + optional **`generator`**). See **`models.ts`** and **`packages/content/src/tools/generate-map.ts`**.

## Head-specific wrappers

| Head | Wrapper | Notes |
|------|---------|-------|
| **Next.js** | `@sitecore-content-sdk/nextjs/config` **`defineConfig`** | **`getNextFallbackConfig`** adds **`NEXT_PUBLIC_*`**, preview multisite cookie behavior, **`GENERATE_STATIC_PATHS`**, **`SITECORE_INTERNAL_EDITING_HOST_URL`**, etc. |
| **Angular** | `@sitecore-content-sdk/angular` **`defineConfig`** | Merges **`clientEnv`** (generated **`environment*.ts`**) with **`getProcessEnv()`** on the server, then calls content **`defineConfig`**. |

## Related

- [doc-config-environment-variables.md](doc-config-environment-variables.md) — **`buildFallbackConfig`** env keys
- [doc-sitecore-client-and-graphql.md](doc-sitecore-client-and-graphql.md) — **`SitecoreClient`** + GraphQL URL selection
- [../content-sdk-nextjs/doc-sitecore-config.md](../content-sdk-nextjs/doc-sitecore-config.md) — Next-only **`SitecoreConfigInput`** fields and App Router multisite notes
- [../content-sdk-angular/doc-environment-and-define-config-angular.md](../content-sdk-angular/doc-environment-and-define-config-angular.md) — Angular env generation

## Raw (official topic)

- `llm-wiki/raw/2026-05-14-the-sitecore-configuration-file.md`
