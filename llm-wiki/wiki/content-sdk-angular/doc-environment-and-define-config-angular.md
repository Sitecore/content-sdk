# Environment and `defineConfig` (Angular)

How the Angular head avoids raw **`process.env`** in the browser and still feeds **`defineConfig`** from `@sitecore-content-sdk/content`.

**Sources:** [raw extract](../../raw/2026-05-14-jss-angular-live-design-architecture.md) · [architecture index](doc-architecture-loaders-and-ssr.md)

**Shared with all heads:** [../common/doc-config-environment-variables.md](../common/doc-config-environment-variables.md) (**`buildFallbackConfig`** env keys; public prefix **`CSDK_PUBLIC_*`** vs **`NEXT_PUBLIC_*`**) · [../common/doc-sitecore-config-input.md](../common/doc-sitecore-config-input.md) (merge pipeline, **`SitecoreConfigInput`** tables).

## Angular `defineConfig` wrapper

`packages/angular/src/config/define-config.ts` merges a **`clientEnv`** record with **`getProcessEnv()`** (Node on the server, empty on the client) and forwards to the shared **`defineConfig`** from **`@sitecore-content-sdk/content/config`**. Call sites pass **`clientEnv`** from generated **`environment.ts`** so public values exist in browser bundles.

## Scaffold: `generate-environment.ts`

The template script **`packages/create-content-sdk-app/src/templates/angular/scripts/generate-environment.ts`** loads **`.env`**, **`.env.local`**, and mode-specific **`.env.dev`** / **`.env.prod`**, filters keys prefixed with **`CSDK_PUBLIC_`**, and writes **`src/environments/environment.dev.ts`** and **`environment.prod.ts`**. The build selects the right variant so **`defineConfig`** receives stable literals instead of runtime **`process.env`** reads in client code.

Only **`CSDK_PUBLIC_*`** keys are embedded in those files; server secrets use **`process.env`** at runtime (see script header comment and **`load-env`** / server bootstrap).

## GraphQL and `SitecoreClient`

Merged **`SitecoreConfig`** drives **`createGraphQLClientFactory`** and **`SitecoreClient`** the same way as for any head using **`@sitecore-content-sdk/content`**; see [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md) — **Angular usage** for **`getClient()`** + **`new SitecoreClient(scConfig)`**.

**Related:** [doc-sitecore-config-typescript-angular.md](doc-sitecore-config-typescript-angular.md) · Next-only **`getNextFallbackConfig`** pipeline: [doc-sitecore-config.md](../content-sdk-nextjs/doc-sitecore-config.md)
