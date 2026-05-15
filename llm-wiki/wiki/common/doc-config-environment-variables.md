# Environment variables and `buildFallbackConfig`

How **`@sitecore-content-sdk/content`** fills **`SitecoreConfig`** from an env-like record (e.g. **`process.env`**, or **`clientEnv`** merged in by a head’s **`defineConfig`**). **`buildFallbackConfig`** in **`packages/content/src/config/define-config.ts`** uses **string literal** keys only; TypeScript **constant** names such as **`SITECORE_EDGE_PLATFORM_HOSTNAME_ENV`** are **not** environment variable names—they exist so the code can index **`env['SITECORE_EDGE_PLATFORM_HOSTNAME']`** without repeating the string.

**Code:** `packages/content/src/config/define-config.ts` — **`buildFallbackConfig`**.

## Key prefixes (by head)

| Prefix | Typical use |
|--------|----------------|
| **`SITECORE_*`** | Server-side / shared secrets and IDs (Next **`.env`**, Angular server **`process.env`**, CI). |
| **`NEXT_PUBLIC_*`** | **Next.js** convention for values that must exist in the browser bundle; **`buildFallbackConfig`** reads several of these directly (alongside **`SITECORE_*`** / **`CSDK_PUBLIC_*`**). |
| **`CSDK_PUBLIC_*`** | **Angular** convention only: the scaffold’s **`generate-environment.ts`** copies only these keys into **`environment.*.ts`**, which become **`clientEnv`** for **`@sitecore-content-sdk/angular`** **`defineConfig`**. Next templates do **not** rely on this prefix for public config. |

Any head may pass a merged map into **`defineConfig`**, so multiple prefixes can appear in the same object at runtime (e.g. Angular SSR merges **`clientEnv`** with **`process.env`**).

## `buildFallbackConfig` env keys (exact names)

Values below follow **`env.A \|\| env.B \|\| …`** in **`buildFallbackConfig`** unless noted.

| Area | Environment variable keys (in evaluation order) |
|------|---------------------------------------------------|
| Edge hostname (input to **`resolveEdgeUrl`**) | `CSDK_PUBLIC_SITECORE_EDGE_HOSTNAME`, then `SITECORE_EDGE_PLATFORM_HOSTNAME` |
| Edge context ID | `SITECORE_EDGE_CONTEXT_ID` |
| Edge **client** context ID | `SITECORE_EDGE_CLIENT_CONTEXT_ID`, then `CSDK_PUBLIC_SITECORE_EDGE_CONTEXT_ID` |
| Local GraphQL **API key** | `SITECORE_API_KEY`, then `CSDK_PUBLIC_SITECORE_API_KEY`, then `NEXT_PUBLIC_SITECORE_API_KEY` |
| Local GraphQL **host** | `SITECORE_API_HOST`, then `CSDK_PUBLIC_SITECORE_API_HOST`, then `NEXT_PUBLIC_SITECORE_API_HOST` |
| Editing secret | `SITECORE_EDITING_SECRET` (if unset, code uses placeholder string **`editing-secret-missing`**) |
| Default site | `SITECORE_DEFAULT_SITE`, then `CSDK_PUBLIC_SITECORE_DEFAULT_SITE`, then `CSDK_PUBLIC_DEFAULT_SITE` |
| Default language | `SITECORE_DEFAULT_LANGUAGE`, then `CSDK_PUBLIC_DEFAULT_LANGUAGE`; if still empty, defaults to **`en`** |
| Personalize — Edge timeout (ms) | `PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT` (parsed integer; default **400** if missing/invalid) |
| Personalize — CDP timeout (ms) | `PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT` (parsed integer; default **400** if missing/invalid) |
| Personalize — scope | `SITECORE_PERSONALIZE_SCOPE`, then `CSDK_PUBLIC_PERSONALIZE_SCOPE`, then `NEXT_PUBLIC_PERSONALIZE_SCOPE` |
| Redirects / personalize **enabled** flags | Derived from **`NODE_ENV`** (`!== 'development'` → enabled), not separate `SITECORE_*` keys |
| Local GraphQL **path** | Not from env: hardcoded **`/sitecore/api/graph/edge`** in this fallback object (overridable via **`sitecore.config.ts`**) |

**Source for `SITECORE_EDGE_PLATFORM_HOSTNAME`:** the content package imports **`SITECORE_EDGE_PLATFORM_HOSTNAME_ENV`** from **`@sitecore-content-sdk/core/tools`**; that export’s value is the string **`'SITECORE_EDGE_PLATFORM_HOSTNAME'`** (`packages/core/src/tools/resolve-edge-url.ts`).

## By head (how env reaches `defineConfig`)

### Next.js

- **`getNextFallbackConfig`** (in **`@sitecore-content-sdk/nextjs/config`**) layers **`NEXT_PUBLIC_*`** and other Next-specific keys before calling content **`defineConfig`**.
- **`sitecore.config.ts`** may still set values explicitly; merge rules in [doc-sitecore-config-input.md](doc-sitecore-config-input.md) apply.

### Angular

- **Browser:** `process.env` is not reliable in the client bundle. The template runs **`scripts/generate-environment.ts`**, which reads **`.env`**, **`.env.local`**, **`.env.dev`** / **`.env.prod`** and writes only keys prefixed with **`CSDK_PUBLIC_*`** into **`src/environments/environment.dev.ts`** / **`environment.prod.ts`** as string literals.
- **`sitecore.config.ts`** passes that object as **`clientEnv`** into **`defineConfig`** from **`@sitecore-content-sdk/angular`**, which merges **`clientEnv`** with **`getProcessEnv()`** (Node/SSR only) and forwards to content **`defineConfig`**.
- Server entry loads dotenv (e.g. **`load-env.ts`**) so **`SITECORE_*`** secrets exist at runtime for SSR and Express without embedding them in the browser bundle.

## Product / security notes

- Use **`.env.*.example`** (placeholders only) in templates; copy to **`.env.local`** for real values. Never commit secrets.
- Next template examples: [../content-sdk-nextjs/doc-example-environment-variable-files.md](../content-sdk-nextjs/doc-example-environment-variable-files.md).

## Related

- [doc-sitecore-config-input.md](doc-sitecore-config-input.md) — full **`SitecoreConfigInput`** reference
- [doc-sitecore-client-and-graphql.md](doc-sitecore-client-and-graphql.md) — GraphQL endpoint resolution from merged config
