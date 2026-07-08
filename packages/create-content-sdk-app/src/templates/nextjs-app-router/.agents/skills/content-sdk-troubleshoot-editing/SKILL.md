---
name: content-sdk-troubleshoot-editing
description: Check draftMode, getPreviewData(headers), setRequestLocale, getCachedPageParams, maps.
---

# Troubleshoot editing (App Router)

**Detail:** [AGENTS-router-specifics.md#data-fetching-and-preview](../../docs/AGENTS-router-specifics.md#data-fetching-and-preview)

## When

- Editing/preview/design library broken

## Rules

- `await draftMode()` in Server Components
- Preview: `draftMode()` + `client.getPreviewData(await headers())` then `getPreview` / `getDesignLibraryData`
- Verify component maps and editing API routes under `src/app/api/editing/`

## Stop

- Escalate if editor/platform issue outside app

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
