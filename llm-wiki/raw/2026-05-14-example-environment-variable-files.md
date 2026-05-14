---
title: Example environment variable files
source_url: https://doc.sitecore.com/sai/en/developers/content-sdk/20/example-environment-variable-files.html
doc_version: "2.x"
ingested: "2026-05-14"
fetch_status: ok
---

# Example environment variable files (snapshot)

Content SDK apps from **0.2.0+** ship **`.example`** env files to help configure local dev for **local container** vs **remote SitecoreAI**.

## Purpose (per official doc)

- Show which variables Content SDK expects.
- Show how to set them per environment.
- Avoid committing secrets (**.example** only — no real secrets).

## Files (official)

| File | Purpose |
|------|---------|
| **`.env.container.example`** | Local dev against a **local SitecoreAI container**. |
| **`.env.remote.example`** | Local dev against a **remote** SitecoreAI instance. |

Templates in repo are editable; keep **`.example`** files updated when SDK adds vars. **Do not** put client secrets in `.example` files.

## Implement

Copy the relevant **`.example`** into **`.env.local`** and fill values.

## Template code (Pages Router)

Shipped under `packages/create-content-sdk-app/src/templates/nextjs/`:

- `.env.container.example` — `SITECORE_EDITING_SECRET`, `NEXT_PUBLIC_DEFAULT_SITE_NAME`, `NEXT_PUBLIC_DEFAULT_LANGUAGE`, `NEXT_PUBLIC_SITECORE_API_KEY`, `NEXT_PUBLIC_SITECORE_API_HOST`, optional `DEBUG`.
- `.env.remote.example` — same defaults plus Edge (`SITECORE_EDGE_CONTEXT_ID`, `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID`, optional Edge hostname / Personalize / Design Library auth vars).

Wiki: `llm-wiki/wiki/content-sdk-nextjs/doc-example-environment-variable-files.md`.

Full page: `source_url`.
