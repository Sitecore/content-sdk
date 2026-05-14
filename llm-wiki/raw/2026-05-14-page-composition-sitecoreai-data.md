---
title: Page composition in Content SDK apps using SitecoreAI data
source_url: https://doc.sitecore.com/sai/en/developers/content-sdk/20/page-composition-in-content-sdk-apps-using-sitecoreai-data.html
doc_version: "2.x"
ingested: "2026-05-14"
---

# Page composition (snapshot)

Pages use SitecoreAI **layouts**: named placeholders hosting components. Authors use WYSIWYG in SitecoreAI. Content SDK uses a top-level **Layout** component with at least one **root** placeholder mirroring SitecoreAI. Component hierarchy is **dynamic** from layout **JSON** returned by **GraphQL** (Experience Edge or local) over HTTP. Placeholder names and component types in the app must match what authors configure. Layout data is JSON from SitecoreAI GraphQL via route handling / data fetching; front ends consume that JSON shape.

**Wiki alignment:** Do not describe head layout as “CMS XML vs app JSON”; GraphQL responses are JSON. See `llm-wiki/wiki/content-sdk-nextjs/doc-architecture-edge-graphql.md`.

Related official topics: dynamic placeholders, placeholders in Content SDK apps, components, route handling.

Full page: see `source_url`.
