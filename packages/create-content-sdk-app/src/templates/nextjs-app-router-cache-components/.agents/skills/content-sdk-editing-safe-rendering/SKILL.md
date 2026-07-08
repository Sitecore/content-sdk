---
name: content-sdk-editing-safe-rendering
description: Preview/editing via draftMode() and getPreview/getDesignLibraryData in App Router pages.
---

# Editing-safe rendering (App Router + Cache Components)

**Detail:** [AGENTS-router-specifics.md#data-fetching-and-preview](../../docs/AGENTS-router-specifics.md#data-fetching-and-preview)

## When

- Editing, preview, or design library behavior

## Rules

- Preview: `draftMode()` + `client.getPreview` / `getDesignLibraryData` directly — never wrap in `use cache`
- Use SDK field components in layout placeholders

## Stop

- Never wrap preview reads in `use cache`

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
