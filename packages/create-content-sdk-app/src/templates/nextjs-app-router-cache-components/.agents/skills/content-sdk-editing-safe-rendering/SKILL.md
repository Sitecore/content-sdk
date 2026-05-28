---
name: content-sdk-editing-safe-rendering
description: Ensures components render safely in XM Cloud editing and preview. App Router + Cache Components uses draftMode() and getPreview/getDesignLibraryData from searchParams — these calls are DYNAMIC and must NOT be wrapped in 'use cache'. Use when making components work in the Sitecore editor or fixing preview/editing behavior.
---

# Content SDK Editing-Safe Rendering (App Router + Cache Components)

Ensure components behave correctly in XM Cloud editing, preview, and design library. This app uses **draftMode()** and **searchParams** for editing data; preview / design library reads must remain **dynamic** (never wrapped in `'use cache'`).

## When to Use

- User asks about editing, preview, design library, or "component not working in editor."
- Task involves draft mode, editing chromes, or design library integration.
- Fixing issues where components render differently or break in editor vs published.
- User mentions getPreview, getDesignLibraryData, or editing API routes.

## How to perform

- In the page or layout: call `draftMode()`; when enabled, read editing params from searchParams, use `isDesignLibraryPreviewData(editingParams)` to choose getDesignLibraryData vs getPreview; otherwise use the cache helper `getSitecorePage`. Editing routes: config route uses `createEditingConfigRouteHandler`, render route uses `createEditingRenderRouteHandlers`.

## Hard Rules

- Use `draftMode()` in Server Components (e.g. in the page or [site] layout). When `draft.isEnabled`, get editing params from **searchParams** and use `isDesignLibraryPreviewData(editingParams)` to distinguish: if true, use `client.getDesignLibraryData(editingParams)`; otherwise use `client.getPreview(editingParams)`. **Call these directly on the SDK client** (`src/lib/sitecore-client.ts`), not through the cache helpers.
- **Do not wrap preview / design library reads in `'use cache'`.** Preview content must remain dynamic so editors see their latest changes immediately. The cache helpers in `src/lib/cache/` are only for non-preview reads.
- When not in draft mode, use `getSitecorePage({ site, locale, path: path ?? [] })` from `src/lib/cache/get-sitecore-page.ts` for the page read.
- Do not assume editing/preview context in components that might run in static or non-editing contexts; guard on `draftMode()`.
- Editing API routes: `src/app/api/editing/config/route.ts` uses `createEditingConfigRouteHandler({ components, clientComponents, metadata })` (import from `.sitecore/component-map`, `.sitecore/component-map.client`, `.sitecore/metadata.json`). `src/app/api/editing/render/route.ts` uses `createEditingRenderRouteHandlers({})`. With `cacheComponents: true`, the explicit `dynamic = 'force-dynamic'` is not needed (Next.js handles it).
- Never commit editing secrets; use environment variables and document in .env.example only.

## Stop Conditions

- Stop and clarify if the issue is preview vs design library vs published; behavior differs.
- Stop if the user wants to cache preview / design library reads; explain why preview must remain dynamic.
- Do not change proxy or middleware order to "fix" editing; editing is driven by API routes, draft/preview data, and PreviewProxy.
- Do not recommend disabling secret validation without explicit user request and warning.

## References

- [AGENTS.md](../../../AGENTS.md) for data fetching, preview flow, and editing routes.
- content-sdk-graphql-data-fetching for cache-vs-preview decisions.
- [Official Content SDK docs](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
