# Sitecore configuration (`sitecore.config.ts`)

Synthesized from official [The Sitecore configuration file](https://doc.sitecore.com/sai/en/developers/content-sdk/20/the-sitecore-configuration-file.html) (tables in `llm-wiki/raw/2026-05-14-the-sitecore-configuration-file.md`) and **`SitecoreConfigInput`** in `packages/content/src/config/models.ts`.

**Shared reference (all heads):** [../common/doc-sitecore-config-input.md](../common/doc-sitecore-config-input.md) — full **`SitecoreConfigInput`** tables, merge pipeline, **`api.edge` / `api.local`**, CLI config. [../common/doc-config-environment-variables.md](../common/doc-config-environment-variables.md) — **`buildFallbackConfig`** env keys. [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md) — GraphQL URL selection and **`SitecoreClient`**.

## Where it lives

- Generated apps: root **`sitecore.config.ts`**.
- Templates: `packages/create-content-sdk-app/src/templates/nextjs/sitecore.config.ts`, `nextjs-app-router/sitecore.config.ts`.

## Next.js resolution pipeline

1. **`defineConfig`** from **`@sitecore-content-sdk/nextjs/config`** (`packages/nextjs/src/config/define-config.ts`) runs **`getNextFallbackConfig`**: merges **`NEXT_PUBLIC_*`**, **`VERCEL_ENV === 'preview'`** for multisite cookie resolution, **`GENERATE_STATIC_PATHS`**, **`SITECORE_INTERNAL_EDITING_HOST_URL`** (see `packages/nextjs/src/config/define-config.ts` for the complete list).
2. Passes merged env to content **`defineConfig`** — the shared `buildFallbackConfig` → `deepMerge` → `resolveEdgeUrl` → CLI validation pipeline applies. See [common merge pipeline](../common/doc-sitecore-config-input.md).

## Next-only `SitecoreConfigInput` fields

(`packages/nextjs/src/config/define-config.ts`)

| Key | Type | Purpose |
|-----|------|---------|
| `generateStaticPaths` | `boolean?` | SSG path prebuild; env **`GENERATE_STATIC_PATHS`** overrides; default **true** if unset. |
| `sitecoreInternalEditingHostUrl` | `string?` | Base URL for editing middleware internal fetch; env **`SITECORE_INTERNAL_EDITING_HOST_URL`**. |

## Multisite (Next App Router)

When using the **`[site]`** segment pattern, keep **`multisite.enabled`** consistent with routing expectations — disabling it can break site resolution for that layout. Cookie resolution defaults may change under preview (`VERCEL_ENV`); see **`getNextFallbackConfig`** in `packages/nextjs/src/config/define-config.ts`.

## Code as source of truth

| Need | Path |
|------|------|
| Types | `packages/content/src/config/models.ts` |
| Fallback + merge | `packages/content/src/config/define-config.ts` |
| Next wrapper | `packages/nextjs/src/config/define-config.ts` |
| GraphQL URL / `SitecoreClient` | [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md) |

## Related

- [doc-example-environment-variable-files.md](doc-example-environment-variable-files.md) — `.env.*.example` vs `defineConfig` / env.
- [doc-editor-integration-metadata.md](doc-editor-integration-metadata.md) — `editingSecret`, render host.
- [doc-terminology-platform-names.md](../common/doc-terminology-platform-names.md)
- [../content-sdk-angular/index.md](../content-sdk-angular/index.md) — other heads in this monorepo (start here for Angular)

## Raw

- `llm-wiki/raw/2026-05-14-the-sitecore-configuration-file.md`
