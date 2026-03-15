---
name: content-sdk-troubleshoot-editing
description: Troubleshoots XM Cloud editing, preview, and design library for App Router. Check draftMode(), getPreview/getDesignLibraryData from searchParams, setRequestLocale, and component maps. Use when editing or preview does not behave as expected.
---

# Content SDK Troubleshoot Editing (App Router)

This skill focuses on **diagnosing** editing, preview, and design library issues. For implementing editing-safe rendering (draftMode, getPreview/getDesignLibraryData, API routes), use the **content-sdk-editing-safe-rendering** skill; the two are complementary (implementation vs. troubleshooting).

Diagnose and fix editing, preview, and design library issues without breaking the single client or proxy order. This app uses **draftMode()** and **searchParams** for preview data.

## When to Use

- User reports that editing, preview, or design library is broken or inconsistent.
- Task involves debugging "not working in editor," missing chromes, or wrong data in preview.
- User mentions "editing broken," "preview not working," "design library," or "editor issues."

## How to perform

- Confirm `draftMode()` and searchParams-based getPreview/getDesignLibraryData; ensure `setRequestLocale` is called at the top of the page. Verify editing API routes are not rewritten (check proxy matcher) and both component maps include the component. Check env (editingSecret, API config) and .env.example documentation.

## Hard Rules

- **Preview flow:** Use `draftMode()` in Server Components; when enabled, use `client.getPreview(editingParams)` or `client.getDesignLibraryData(editingParams)` from **searchParams**. Ensure site/locale are passed correctly (e.g. from route params or editingParams).
- **next-intl:** Ensure `setRequestLocale(\`${site}_${locale}\`)` is called at the top of the page; missing setRequestLocale can cause locale or dictionary issues in editor.
- Editing API routes (`src/app/api/editing/config/route.ts`, `editing/render/route.ts`) must be reachable and use the same component maps (component-map.ts and component-map.client.ts) and config as the app. Check matcher in proxy.ts so /api/editing is not rewritten or blocked.
- Check that both component maps include all components used in the layout; missing registration causes "component not found" in editor.
- Environment: editingSecret and API config must be set (in env); document in .env.example only. Do not log or commit secrets.

## Stop Conditions

- Stop if the fix would require changing CI, deployment, or XM Cloud project settings; suggest the user do that and document the required env or config.
- Stop if the issue might be in Sitecore (layout, template) rather than the app; suggest checking layout and content in XM Cloud.
- Do not recommend disabling security (e.g. skipping secret validation) without explicit user request and warning.

## References

- content-sdk-editing-safe-rendering skill and [AGENTS.md](../../../AGENTS.md) for preview and editing flow.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
