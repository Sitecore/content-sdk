---
name: content-sdk-troubleshoot-editing
description: Troubleshoots XM Cloud editing, preview, and design library: common issues, headers, and debugging. Use when editing or preview does not behave as expected.
---

# Content SDK Troubleshoot Editing

Diagnose and fix editing, preview, and design library issues without breaking the single client or proxy order.

## When to Use

- User reports that editing, preview, or design library is broken or inconsistent.
- Task involves debugging "not working in editor," missing chromes, or wrong data in preview.
- User mentions "editing broken," "preview not working," "design library," or "editor issues."

## Hard Rules

- Verify draft mode / preview flow: App Router uses draftMode() and getPreview/getDesignLibraryData from searchParams; Pages Router uses context.preview and context.previewData. Editing API routes (config, render) must be reachable and use the same component map as the app.
- Do not change proxy or middleware order to fix editing; editing is driven by API routes and draft/preview data. Check matcher/skip so editing routes are not rewritten or blocked.
- Check that component map (and client map in App Router) includes all components used in the layout; missing registration causes "component not found" in editor.
- Environment: editingSecret and API config must be set (in env); document in .env.example only. Do not log or commit secrets.
- Common causes: wrong site/locale passed to getPreview/getDesignLibraryData, missing setRequestLocale (App Router), or component not registered.

## Stop Conditions

- Stop if the fix would require changing CI, deployment, or XM Cloud project settings; suggest the user do that and document the required env or config.
- Stop if the issue might be in Sitecore (layout, template) rather than the app; suggest checking layout and content in XM Cloud.
- Do not recommend disabling security (e.g. skipping secret validation) without explicit user request and warning.

## References

- content-sdk-editing-safe-rendering skill and template AGENTS.md for preview and editing flow.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
