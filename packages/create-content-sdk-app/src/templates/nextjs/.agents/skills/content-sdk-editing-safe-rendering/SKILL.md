---
name: content-sdk-editing-safe-rendering
description: Ensures components render safely in XM Cloud editing and preview. Pages Router uses context.preview and context.previewData; use client.getPreview(context.previewData) or getDesignLibraryData(context.previewData) when in preview. Use when making components work in the Sitecore editor or fixing preview/editing behavior.
---

# Content SDK Editing-Safe Rendering (Pages Router)

Ensure components behave correctly in XM Cloud editing, preview, and design library. This app uses **context.preview** and **context.previewData** in getStaticProps/getServerSideProps for editing data.

## When to Use

- User asks about editing, preview, design library, or "component not working in editor."
- Task involves draft mode, editing chromes, or design library integration.
- Fixing issues where components render differently or break in editor vs published.
- User mentions getPreview, getDesignLibraryData, or editing API routes.

## How to perform

- In [[...path]].tsx getStaticProps/getServerSideProps: check context.preview; when true use isDesignLibraryPreviewData(context.previewData) to choose getDesignLibraryData vs getPreview; otherwise getPage + getDictionary + getComponentData. Editing routes: config uses EditingConfigMiddleware, render uses EditingRenderMiddleware, feaas/render uses FEAASRenderMiddleware; export handler as default.

## Hard Rules

- In the catch-all page (`src/pages/[[...path]].tsx`), use `context.preview` and `context.previewData`. When in preview, use `isDesignLibraryPreviewData(context.previewData)` to distinguish: if true, use `client.getDesignLibraryData(context.previewData)`; otherwise use `client.getPreview(context.previewData)`. When not in preview, use `getPage(path, { locale: context.locale })` then getDictionary and getComponentData as usual.
- Do not assume editing/preview context in components that might run in static or non-editing contexts; guard on context.preview in getStaticProps/getServerSideProps.
- Editing API routes: `src/pages/api/editing/config.ts` uses `EditingConfigMiddleware({ components, metadata }).getHandler()` (import components from `.sitecore/component-map`, metadata from `.sitecore/metadata.json`). `src/pages/api/editing/render.ts` uses `EditingRenderMiddleware().getHandler()`. `src/pages/api/editing/feaas/render.ts` uses `FEAASRenderMiddleware().getHandler()`. Export the handler as default. Do not duplicate client creation; config uses the same component map as the app.
- Never commit editing secrets; use environment variables and document in .env.example only.

## Stop Conditions

- Stop and clarify if the issue is preview vs design library vs published; behavior differs.
- Do not change proxy or middleware order to "fix" editing; editing is driven by API routes and context.previewData.
- Do not recommend disabling secret validation without explicit user request and warning.

## References

- [AGENTS.md](../../../AGENTS.md) for data fetching, preview flow, and editing routes.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
