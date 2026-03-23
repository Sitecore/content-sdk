---
name: content-sdk-editing-safe-rendering
description: Ensures components render safely in XM Cloud editing and preview. Pages Router uses context.preview and context.previewData; use client.getPreview(context.previewData) or getDesignLibraryData(context.previewData) when in preview. Use when making components work in the Sitecore editor or fixing preview/editing behavior.
---

# Editing / preview (Pages Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — Catch-all flow, editing API routes.

## When

- Editor, preview, design library, or chromes behave incorrectly.

## Rules

- In `[[...path]].tsx` data fetching: if `context.preview`, use `isDesignLibraryPreviewData(context.previewData)` then `getDesignLibraryData` vs `getPreview`; else `getPage` + dictionary + `getComponentData`.
- Editing routes: `api/editing/config`, `render`, `feaas/render` use SDK middlewares and the same `.sitecore/component-map` as the app.
- Secrets only via env; document in `.env.example`.

## Stop

- Do not reorder Edge proxy to “fix” editing; do not disable secret checks without explicit user consent.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
