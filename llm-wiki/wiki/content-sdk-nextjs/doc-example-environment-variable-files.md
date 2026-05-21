# Example environment variable files

From [Example environment variable files](https://doc.sitecore.com/sai/en/developers/content-sdk/20/example-environment-variable-files.html). Raw: `llm-wiki/raw/2026-05-14-example-environment-variable-files.md`.

## Product intent

- **`.env.*.example`** files document required variables for **container** vs **remote** SitecoreAI dev.
- Copy into **`.env.local`** for real values; never commit secrets into **`.example`** files.

## Where they live in this monorepo

**Pages Router** template: `packages/create-content-sdk-app/src/templates/nextjs/`

| Template file | When to use |
|---------------|-------------|
| `.env.container.example` | Local GraphQL against **Docker / local** Sitecore — `NEXT_PUBLIC_SITECORE_API_HOST`, `NEXT_PUBLIC_SITECORE_API_KEY`, editing + default site/language. |
| `.env.remote.example` | **Experience Edge** / remote — `SITECORE_EDGE_CONTEXT_ID`, `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID`, optional `NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME`, Personalize timeouts/scope, optional Design Library auth vars. |

(App Router template ships its own `.env.*.example` under `templates/nextjs-app-router/` — same pattern, different variable set; align with that template when scaffolding.)

## Relationship to `sitecore.config.ts`

`defineConfig` / **`buildFallbackConfig`** read the same logical settings from **`process.env`** (and Next’s **`getNextFallbackConfig`** layers **`NEXT_PUBLIC_*`**). Keeping **`.env.local`** and **`sitecore.config.ts`** in sync (especially **`NEXT_PUBLIC_DEFAULT_LANGUAGE`** ↔ **`defaultLanguage`**, site name, Edge IDs) avoids subtle mismatches. See [doc-sitecore-config.md](doc-sitecore-config.md).

## Angular template (cross-head)

The Angular scaffold does **not** use **`NEXT_PUBLIC_*`** for the browser bundle the same way. It documents **`CSDK_PUBLIC_*`** in **`.env.example`**, runs **`scripts/generate-environment.ts`**, and emits **`src/environments/environment.*.ts`** so **`defineConfig`** receives literals in the client. Server-only variables stay in **`process.env`** (loaded before `sitecore.config` on the server). Canonical table of **`buildFallbackConfig`** keys (shared with Next): [../common/doc-config-environment-variables.md](../common/doc-config-environment-variables.md).

## Related

- [doc-sitecore-config.md](doc-sitecore-config.md)
- [../common/doc-config-environment-variables.md](../common/doc-config-environment-variables.md)
- [doc-i18n-multilingual.md](doc-i18n-multilingual.md) — `NEXT_PUBLIC_DEFAULT_LANGUAGE` and Next `i18n.defaultLocale`
