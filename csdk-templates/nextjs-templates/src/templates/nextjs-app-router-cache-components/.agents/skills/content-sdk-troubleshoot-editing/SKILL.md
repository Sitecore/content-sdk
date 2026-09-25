---
name: content-sdk-troubleshoot-editing
description: Check draftMode, preview on client (not cache helpers), setRequestLocale, maps.
---

# Troubleshoot editing (App Router + Cache Components)

**Detail:** [AGENTS-router-specifics.md#data-fetching-and-preview](../../docs/AGENTS-router-specifics.md#data-fetching-and-preview)

## When

- Editing/preview/design library broken

## Rules

- `await draftMode()` in Server Components
- Preview: `draftMode()` + `client.getPreview` / `getDesignLibraryData` directly — never wrap in `use cache`
- Verify component maps and editing API routes under `src/app/api/editing/`

## Stop

- Escalate if editor/platform issue outside app

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
