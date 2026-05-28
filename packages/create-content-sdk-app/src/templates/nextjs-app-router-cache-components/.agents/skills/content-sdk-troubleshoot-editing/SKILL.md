---
name: content-sdk-troubleshoot-editing
description: Troubleshoots XM Cloud editing, preview, and design library for App Router + Cache Components. Check draftMode(), getPreview/getDesignLibraryData from searchParams, setRequestLocale, component maps, and ensure preview is NOT going through the cache helpers. Use when editing or preview does not behave as expected.
---

# Content SDK Troubleshoot Editing (App Router + Cache Components)

This skill focuses on **diagnosing** editing, preview, and design library issues. For implementing editing-safe rendering (draftMode, getPreview/getDesignLibraryData, API routes), use the **content-sdk-editing-safe-rendering** skill; the two are complementary (implementation vs. troubleshooting).

Diagnose and fix editing, preview, and design library issues without breaking the single client, the cache helpers, or proxy order. A common cause of stale or wrong preview output in this template is **accidentally routing preview through the cache helpers** — preview must stay dynamic.

## When to Use

- User reports that editing, preview, or design library is broken or inconsistent.
- Task involves debugging "not working in editor," missing chromes, wrong data in preview, or stale preview content.
- User mentions "editing broken," "preview not working," "design library," "editor issues," or "stale preview."

## How to perform

- Confirm `draftMode()` and searchParams-based getPreview/getDesignLibraryData; ensure `setRequestLocale` is called at the top of the page. Verify editing API routes are not rewritten (check proxy matcher and that PreviewProxy authorizes editing-host requests) and both component maps include the component. Check env (editingSecret, API config) and .env.example documentation. Critically: ensure the preview branch in `page.tsx` calls `client.getPreview` / `client.getDesignLibraryData` directly, not the `getSitecorePage` cache helper.

## Hard Rules

- **Preview flow:** Use `draftMode()` in Server Components; when enabled, call `client.getPreview(editingParams)` or `client.getDesignLibraryData(editingParams)` from **searchParams** directly on the SDK client. Ensure site/locale are passed correctly (e.g. from route params or editingParams).
- **Preview must be dynamic:** If preview content looks stale, suspect that preview is being routed through the cache helpers (`getSitecorePage` / `getSitecoreErrorPage`) instead of `client.getPreview`. The cache helpers declare `'use cache'`; using them for preview data freezes the editor view.
- **Editing routes are excluded from caching:** Editing API routes (`/api/editing/config`, `/api/editing/render`) must not be wrapped in `'use cache'` and must be reachable (check proxy matcher — `/api/*` is excluded). Editing routes use the same component maps as the app.
- **next-intl:** Ensure `setRequestLocale(\`${site}_${locale}\`)` is called at the top of the page; missing setRequestLocale can cause locale or dictionary issues in editor.
- **PreviewProxy:** The chain starts with PreviewProxy, which authorizes preview requests on the editing host. If preview redirects to a sign-in or fails on the editing host, check the editing secret env var and that PreviewProxy is first in the chain.
- Check that both component maps include all components used in the layout; missing registration causes "component not found" in editor.
- Environment: editingSecret and API config must be set (in env); document in .env.example only. Do not log or commit secrets.

## Stop Conditions

- Stop if the fix would require changing CI, deployment, or XM Cloud project settings; suggest the user do that and document the required env or config.
- Stop if the issue might be in Sitecore (layout, template) rather than the app; suggest checking layout and content in XM Cloud.
- Do not recommend disabling security (e.g. skipping secret validation) without explicit user request and warning.

## References

- content-sdk-editing-safe-rendering skill and [AGENTS.md](../../../AGENTS.md) for preview and editing flow.
- content-sdk-cache-components-and-osr for understanding which code paths are cached vs. dynamic.
- [Official Content SDK docs](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
