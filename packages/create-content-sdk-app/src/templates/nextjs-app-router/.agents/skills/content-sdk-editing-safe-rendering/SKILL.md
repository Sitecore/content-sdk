---
name: content-sdk-editing-safe-rendering
description: Ensures components render safely in XM Cloud editing and preview. App Router uses draftMode() and getPreview/getDesignLibraryData from searchParams. Use when making components work in the Sitecore editor or fixing preview/editing behavior.
---

# Editing / preview (App Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — `draftMode`, editing API routes.

## When

- Editor, preview, design library, or chromes behave incorrectly.

## Rules

- `await draftMode()`; when enabled, read editing params from `searchParams`, use `isDesignLibraryPreviewData` to pick `getDesignLibraryData` vs `getPreview`; otherwise `getPage(path ?? [], { site, locale })`.
- Config/render routes: `createEditingConfigRouteHandler` / `createEditingRenderRouteHandlers` with both component maps + `dynamic = 'force-dynamic'` where required.
- Secrets only via env; document in `.env.example`.

## Stop

- Do not reorder Edge proxy to “fix” editing; do not disable secret checks without explicit user consent.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
