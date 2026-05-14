---
title: Architecture overview
source_url: https://doc.sitecore.com/sai/en/developers/content-sdk/20/architecture-overview.html
doc_version: "2.x"
ingested: "2026-05-14"
---

# Architecture overview (snapshot)

Content SDK is part of the headless suite for SitecoreAI.

## Experience Edge

Experience Edge delivers layout and dictionary data via **GraphQL**. Official doc states the Edge delivery endpoint path is configured in the app’s **`package.json`** under `config.graphQLEndpointPath`, default `/sitecore/api/graph/edge`.

**Wiki alignment:** Runtime GraphQL endpoint for `SitecoreClient` is resolved from **`sitecore.config` + env** (`api.edge` / `api.local`); see `llm-wiki/wiki/content-sdk-nextjs/doc-architecture-edge-graphql.md` and `content-sdk-nextjs/doc-sitecore-config.md`.

## Content SDK components (per doc)

- Core SDK: retrieve data from Sitecore services/APIs; work with Sitecore data and layout in JavaScript.
- Next.js SDKs: placeholders, field components, layout/field values editable by authors.
- Sample / starter app for Next.js.
- Developer tooling and utilities.

Full page: see `source_url`.
