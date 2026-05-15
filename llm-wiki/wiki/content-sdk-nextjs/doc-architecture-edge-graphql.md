# Architecture: Experience Edge and GraphQL

From official [Architecture overview](https://doc.sitecore.com/sai/en/developers/content-sdk/20/architecture-overview.html), aligned with this repo.

**Runtime detail (all heads):** [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md) — how **`sitecore.config.ts`** + **`defineConfig`** drive Edge/local GraphQL and **`SitecoreClient`**.

## Official doc

- **Experience Edge** delivers layout and dictionary (and related) data via **GraphQL**.
- Doc may cite **`package.json`** → `config.graphQLEndpointPath`, default **`/sitecore/api/graph/edge`**.

## Runtime (this repo)

GraphQL URLs for **`SitecoreClient`** come from **`sitecore.config.ts`** via **`defineConfig`** and **env** — not from `package.json`. See [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md) and [doc-sitecore-config.md](doc-sitecore-config.md).

## Templates

`package.json` may still list `graphQLEndpointPath` but it has no role. Treat **`sitecore.config` + env** as authoritative.

## Implementation

- **`@sitecore-content-sdk/core`** — `GraphQLClient`, factories, retry.
- **`@sitecore-content-sdk/content`** — `SitecoreClient`, layout/dictionary/editing services under `packages/content/src/client`, `packages/content/src/layout`, …

## Mental model

Authors compose pages in SitecoreAI. The head consumes **JSON** (GraphQL responses) from Edge or local GraphQL via **`SitecoreClient`**. Fetch wiring is **Next.js-specific** — Pages Router `getPage` / App Router `draftMode` / middleware. **`@sitecore-content-sdk/react`** renders typed layout data but does not replace **`SitecoreClient`**.

## Raw

- `llm-wiki/raw/2026-05-14-architecture-overview.md`
