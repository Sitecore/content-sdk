---
name: content-sdk-troubleshoot-editing
description: Troubleshoots XM Cloud editing, preview, and design library for Pages Router. Check context.preview, context.previewData, and editing API routes (config, render, feaas/render). Use when editing or preview does not behave as expected.
---

# Content SDK Troubleshoot Editing (Pages Router)

This skill focuses on **diagnosing** editing, preview, and design library issues. For implementing editing-safe rendering (context.preview, getPreview/getDesignLibraryData, API routes), use the **content-sdk-editing-safe-rendering** skill; the two are complementary (implementation vs. troubleshooting).

Diagnose and fix editing, preview, and design library issues without breaking the single client or proxy order. This app uses **context.preview** and **context.previewData** in getStaticProps/getServerSideProps.

## When to Use

- User reports that editing, preview, or design library is broken or inconsistent.
- Task involves debugging "not working in editor," missing chromes, or wrong data in preview.
- User mentions "editing broken," "preview not working," "design library," or "editor issues."

## How to perform

- Confirm context.preview and context.previewData and correct path/locale (extractPath, context.locale). Verify editing API routes (config, render, feaas/render) are not rewritten (check proxy matcher) and component-map.ts includes the component. Check env (editingSecret, API config) and .env.example documentation.

## Hard Rules

- **Preview flow:** In [[...path]].tsx getStaticProps/getServerSideProps, use `context.preview` and `context.previewData`. When in preview, use `client.getPreview(context.previewData)` or `client.getDesignLibraryData(context.previewData)`. Ensure path and locale come from extractPath(context) and context.locale when not in preview.
- Editing API routes: `src/pages/api/editing/config.ts` (EditingConfigMiddleware), `render.ts` (EditingRenderMiddleware), `feaas/render.ts` (FEAASRenderMiddleware) must be reachable and use the same component map (`.sitecore/component-map.ts`) and config as the app. Check proxy `config.matcher` so `/api` is excluded and not rewritten or blocked.
- Check that the component map includes all components used in the layout; missing registration causes "component not found" in editor.
- Environment: editingSecret and API config must be set (in env); document in .env.example only. Do not log or commit secrets.
- Common causes: wrong path/locale passed to getPreview/getDesignLibraryData, or component not registered in component-map.ts.

## Stop Conditions

- Stop if the fix would require changing CI, deployment, or XM Cloud project settings; suggest the user do that and document the required env or config.
- Stop if the issue might be in Sitecore (layout, template) rather than the app; suggest checking layout and content in XM Cloud.
- Do not recommend disabling security (e.g. skipping secret validation) without explicit user request and warning.

## References

- content-sdk-editing-safe-rendering skill and [AGENTS.md](../../../AGENTS.md) for preview and editing flow.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
