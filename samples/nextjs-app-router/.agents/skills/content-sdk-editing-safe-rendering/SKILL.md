---
name: content-sdk-editing-safe-rendering
description: Ensures components render safely in XM Cloud editing and preview. App Router uses draftMode() and getPreview/getDesignLibraryData from searchParams. Use when making components work in the Sitecore editor or fixing preview/editing behavior.
---

# Content SDK Editing-Safe Rendering (App Router)

Ensure components behave correctly in XM Cloud editing, preview, and design library. This app uses **draftMode()** and **searchParams** for editing data.

## When to Use

- User asks about editing, preview, design library, or "component not working in editor."
- Task involves draft mode, editing chromes, or design library integration.
- Fixing issues where components render differently or break in editor vs published.
- User mentions getPreview, getDesignLibraryData, or editing API routes.

## How to perform

- In the page or layout: call `draftMode()`; when enabled, read editing params from searchParams, use `isDesignLibraryPreviewData(editingParams)` to choose getDesignLibraryData vs getPreview; otherwise use getPage. Editing routes: config route uses `createEditingConfigRouteHandler`, render route uses `createEditingRenderRouteHandlers`; set `dynamic = 'force-dynamic'` on both.

## Hard Rules

- Use `draftMode()` in Server Components (e.g. in the page or [site] layout). When `draft.isEnabled`, get editing params from **searchParams** and use `isDesignLibraryPreviewData(editingParams)` to distinguish: if true, use `client.getDesignLibraryData(editingParams)`; otherwise use `client.getPreview(editingParams)`. When not in draft mode, use `getPage(path ?? [], { site, locale })`.
- Do not assume editing/preview context in components that might run in static or non-editing contexts; guard on `draftMode()`.
- Editing API routes: `src/app/api/editing/config/route.ts` uses `createEditingConfigRouteHandler({ components, clientComponents, metadata })` (import from `.sitecore/component-map`, `.sitecore/component-map.client`, `.sitecore/metadata.json`). `src/app/api/editing/render/route.ts` uses `createEditingRenderRouteHandlers({})`. Set `export const dynamic = 'force-dynamic'` on both. Do not duplicate client creation; config and render routes use the same component maps as the app.
- Never commit editing secrets; use environment variables and document in .env.example only.

## Stop Conditions

- Stop and clarify if the issue is preview vs design library vs published; behavior differs.
- Do not change proxy or middleware order to "fix" editing; editing is driven by API routes and draft/preview data.
- Do not recommend disabling secret validation without explicit user request and warning.

## References

- [AGENTS.md](../../../AGENTS.md) for data fetching, preview flow, and editing routes.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
