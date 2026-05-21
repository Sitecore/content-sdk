# Overview: Sitecore Content SDK monorepo

> When this diverges from code, **update this page** to match code and note drift in `../log.md`.

## Platform naming (read this first)

**Sitecore AI**, **SitecoreAI**, **SAI**, **XM Cloud**, **Sitecore XM Cloud**, and **XMC** (in URLs and comments) refer to the **same** platform context for Content SDK work in this repo. See [doc-terminology-platform-names.md](doc-terminology-platform-names.md).

## Purpose

This repository ships **TypeScript packages**, a **scaffolding CLI** (`create-content-sdk-app`), and **templates** for building applications on **SitecoreAI / XM Cloud**. Consumer applications are generated from templates and depend on `@sitecore-content-sdk/*`.

## Doc topic map (ingested 2026-05-14)

| Topic | Wiki |
|--------|------|
| Naming | [doc-terminology-platform-names.md](doc-terminology-platform-names.md) |
| Config types (all heads) | [../common/doc-sitecore-config-input.md](../common/doc-sitecore-config-input.md) |
| Env fallbacks / `buildFallbackConfig` (all heads) | [../common/doc-config-environment-variables.md](../common/doc-config-environment-variables.md) |
| `SitecoreClient` + GraphQL factory (all heads) | [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md) |
| Config / env (Next) | [doc-sitecore-config.md](doc-sitecore-config.md) |
| Edge + GraphQL | [doc-architecture-edge-graphql.md](doc-architecture-edge-graphql.md) |
| GraphQL client factory (Next hub) | [doc-graphql-client-and-edge-urls.md](doc-graphql-client-and-edge-urls.md) |
| Layout / placeholders | [doc-page-composition-placeholders.md](doc-page-composition-placeholders.md) |
| Next data fetching | [doc-route-handling-data-fetching.md](doc-route-handling-data-fetching.md) |
| i18n + dictionary | [doc-i18n-multilingual.md](doc-i18n-multilingual.md) |
| Example `.env` files | [doc-example-environment-variable-files.md](doc-example-environment-variable-files.md) |
| SitecoreClient APIs | [doc-sitecore-client-apis.md](doc-sitecore-client-apis.md) |
| Plugins + adapters | [doc-plugins-and-adapters.md](doc-plugins-and-adapters.md) |
| Page builder / editing | [doc-editor-integration-metadata.md](doc-editor-integration-metadata.md) |
| Ingest bibliography | [source-ingest-2026-05-14-official-docs.md](source-ingest-2026-05-14-official-docs.md) |

## Package map (high level)

| Package | Responsibility |
|---------|----------------|
| `core` | GraphQL client, cache, retry, fetch |
| `analytics-core` | Analytics foundation |
| `content` | Layout, editing, site, media, `SitecoreClient` |
| `search` | Search APIs |
| `events` | Event tracking |
| `personalize` | Personalization |
| `cli` | `sitecore-tools` |
| `create-content-sdk-app` | Scaffolding + templates |
| `nextjs` | Next integration, middleware, editing |
| `react` | Text, Image, Placeholder, … |

## Key repo locations

- Sources: `packages/<name>/src/**`
- Templates: `packages/create-content-sdk-app/src/templates/**`
- LLM raw snapshots: `llm-wiki/raw/`
