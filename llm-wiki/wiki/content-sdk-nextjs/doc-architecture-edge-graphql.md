# Architecture: Experience Edge and GraphQL

From official [Architecture overview](https://doc.sitecore.com/sai/en/developers/content-sdk/20/architecture-overview.html), aligned with this repo.

**Runtime detail (all heads):** [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md) — how **`sitecore.config.ts`** + **`defineConfig`** drive Edge/local GraphQL and **`SitecoreClient`**.

## Official doc

- **Experience Edge** delivers layout and dictionary (and related) data via **GraphQL**.
- Doc may cite **`package.json`** → `config.graphQLEndpointPath`, default **`/sitecore/api/graph/edge`**.

## Runtime (this repo)

GraphQL URLs for **`SitecoreClient`** come from **`sitecore.config.ts`** via **`defineConfig`** and **env** — not primarily from `package.json`. See [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md) and [doc-sitecore-config.md](doc-sitecore-config.md).

## Templates

**Pages Router** `package.json` may still list `graphQLEndpointPath` for tooling alignment. **App Router** template may omit that block — treat **`sitecore.config` + env** as authoritative.

## Implementation

- **`@sitecore-content-sdk/core`** — `GraphQLClient`, factories, retry.
- **`@sitecore-content-sdk/content`** — `SitecoreClient`, layout/dictionary/editing services under `packages/content/src/client`, `packages/content/src/layout`, …

## Mental model

Authors compose pages in SitecoreAI. The head consumes **JSON** (GraphQL responses) from Edge or local GraphQL via **`SitecoreClient`**. Fetch wiring is **framework-specific** (Next `getPage` / App Router / middleware; Angular loaders + **`resolveSitecorePage`**); **`@sitecore-content-sdk/react`** renders typed layout data but does not replace **`SitecoreClient`**.

## Raw

- `llm-wiki/raw/2026-05-14-architecture-overview.md`
