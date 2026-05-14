# Content SDK — Next.js wiki index

Catalog of **Next.js head** pages (`@sitecore-content-sdk/nextjs`, Pages/App Router templates, editing). **Update this file** when you add, rename, or materially change pages here.

## Meta

| Page | Summary |
|------|---------|
| [../index.md](../index.md) | Wiki root hub (all stacks) |
| [../log.md](../log.md) | Append-only timeline (repo-wide) |
| [source-ingest-2026-05-14-official-docs.md](source-ingest-2026-05-14-official-docs.md) | Bibliography for 2026-05-14 official doc batch + follow-up ingests |

## Overview

| Page | Summary |
|------|---------|
| [overview-content-sdk.md](overview-content-sdk.md) | Monorepo purpose, package map, doc topic map, head-app vs SDK scope |
| [doc-terminology-platform-names.md](doc-terminology-platform-names.md) | **SAI / Sitecore AI / XMC / XM Cloud** — interchangeable names in docs and comments |

## Official docs (SAI 2.x) — synthesized

| Page | Summary |
|------|---------|
| [doc-sitecore-config.md](doc-sitecore-config.md) | `sitecore.config.ts` + Next **`defineConfig`** / **`getNextFallbackConfig`**; links to **common** for full **`SitecoreConfigInput`**, env keys, GraphQL + `SitecoreClient` |
| [doc-architecture-edge-graphql.md](doc-architecture-edge-graphql.md) | Experience Edge, GraphQL; runtime vs `package.json` doc note; points to **common** for implementation |
| [doc-graphql-client-and-edge-urls.md](doc-graphql-client-and-edge-urls.md) | Next hub → **common** canonical factory doc; Next dev proxy pointer |
| [doc-page-composition-placeholders.md](doc-page-composition-placeholders.md) | Authoring vs GraphQL JSON; Layout + component map |
| [doc-route-handling-data-fetching.md](doc-route-handling-data-fetching.md) | Catch-all, `getPage` / preview / `getComponentData`; LayoutService path under `packages/content` |
| [doc-i18n-multilingual.md](doc-i18n-multilingual.md) | i18n: App Router `next-intl` (raw) + **Pages Router** code (`next.config` i18n, `extractPath`, `getDictionary`, `next-localization`) |
| [doc-example-environment-variable-files.md](doc-example-environment-variable-files.md) | `.env.container` / `.env.remote` examples, template paths, Angular **`CSDK_PUBLIC_*`** cross-link, link to `sitecore.config` |
| [doc-sitecore-client-apis.md](doc-sitecore-client-apis.md) | **Next** `SitecoreNextjsClient` extensions; **common** for base `SitecoreClient` + GraphQL |
| [doc-plugins-and-adapters.md](doc-plugins-and-adapters.md) | Plugins, adapters, analytics / personalize stack |
| [doc-editor-integration-metadata.md](doc-editor-integration-metadata.md) | Page builder, editing API routes, preview, FEaaS, CSP |

## Concepts & flows

| Page | Summary |
|------|---------|
| [../common/doc-sitecore-client-and-graphql.md](../common/doc-sitecore-client-and-graphql.md) | HTTP / GraphQL endpoint selection (all heads) |

## Source notes

| Page | Summary |
|------|---------|
| [source-ingest-2026-05-14-official-docs.md](source-ingest-2026-05-14-official-docs.md) | URLs → `raw/` + these wiki pages |

---

**Convention:** Relative links within this folder. Shared package topics: [../common/index.md](../common/index.md).
