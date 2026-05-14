# Environment variables and `buildFallbackConfig`

How **`@sitecore-content-sdk/content`** fills **`SitecoreConfig`** from **`process.env`** (and from head-supplied env objects). Same variable *names* support **Next** (often **`NEXT_PUBLIC_*`** or server-only), **Angular** (browser-safe **`CSDK_PUBLIC_*`** literals + server **`process.env`**), and any other consumer of **`defineConfig`**.

**Code:** `packages/content/src/config/define-config.ts` — **`buildFallbackConfig`**.

## `buildFallbackConfig` env keys

| Area | Variables (chained with `\|\|`) |
|------|----------------------------------|
| Edge hostname | `CSDK_PUBLIC_SITECORE_EDGE_HOSTNAME`, `SITECORE_EDGE_PLATFORM_HOSTNAME_ENV` |
| Edge context | `SITECORE_EDGE_CONTEXT_ID` |
| Client context | `SITECORE_EDGE_CLIENT_CONTEXT_ID`, `CSDK_PUBLIC_SITECORE_EDGE_CONTEXT_ID` |
| Local key | `SITECORE_API_KEY`, `CSDK_PUBLIC_SITECORE_API_KEY`, `NEXT_PUBLIC_SITECORE_API_KEY` |
| Local host | `SITECORE_API_HOST`, `CSDK_PUBLIC_SITECORE_API_HOST`, `NEXT_PUBLIC_SITECORE_API_HOST` |
| Editing secret | `SITECORE_EDITING_SECRET` (fallback placeholder if unset) |
| Default site | `SITECORE_DEFAULT_SITE`, `CSDK_PUBLIC_SITECORE_DEFAULT_SITE`, `CSDK_PUBLIC_DEFAULT_SITE` |
| Default language | `SITECORE_DEFAULT_LANGUAGE`, `CSDK_PUBLIC_DEFAULT_LANGUAGE` → default **`en`** |
| Personalize | `PERSONALIZE_MIDDLEWARE_*_TIMEOUT`, scope envs, … |
| Local GraphQL path | Hardcoded **`/sitecore/api/graph/edge`** unless overridden in config |

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
