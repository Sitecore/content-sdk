---
name: content-sdk-editing-safe-rendering
description: Ensures components render safely in XM Cloud editing and preview: draft mode, editing chromes, and design library. Use when making components work in the Sitecore editor, fixing preview/editing behavior, or when the user mentions design library, chromes, or draft mode.
---

# Content SDK Editing-Safe Rendering

Ensure components behave correctly in XM Cloud editing, preview, and design library.

## When to Use

- User asks about editing, preview, design library, or "component not working in editor."
- Task involves draft mode, editing chromes, or design library integration.
- Fixing issues where components render differently or break in editor vs published.
- User mentions getPreview, getDesignLibraryData, or editing API routes.

## Hard Rules

- In App Router: Use `draftMode()` in Server Components; when enabled, use `client.getPreview(editingParams)` or `client.getDesignLibraryData(editingParams)` from searchParams for the page data; otherwise use getPage with site and locale.
- In Pages Router: Use `context.preview` and `context.previewData`; when in preview, use `client.getPreview(context.previewData)` or `client.getDesignLibraryData(context.previewData)`.
- Do not assume editing/preview context in components that might run in static or non-editing contexts; guard on draftMode() or context.preview.
- Editing API routes (e.g. config, render, feaas/render) must use the same component map and config as the app; do not duplicate client creation or config.
- Never commit editing secrets; use environment variables and document in .env.example only.

## Stop Conditions

- Stop if the user is in the monorepo and the change would affect templates; ensure template edits still build (npm install && npm run build in generated app).
- Stop and clarify if the issue is preview vs design library vs published; behavior differs.
- Do not change proxy or middleware order to "fix" editing; editing is driven by API routes and draft/preview data.

## References

- [AGENTS.md](../../../AGENTS.md) and template AGENTS.md (App Router / Pages Router) for data fetching and preview flow.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html) for editing and design library.
