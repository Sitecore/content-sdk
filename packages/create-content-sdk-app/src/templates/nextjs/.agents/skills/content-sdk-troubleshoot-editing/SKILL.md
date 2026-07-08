---
name: content-sdk-troubleshoot-editing
description: Debug Pages Router preview: context.preview, previewData, editing API routes.
---

# Troubleshoot editing (Pages Router)

**Detail:** [AGENTS-router-specifics.md#routing-and-data-fetching](../../docs/AGENTS-router-specifics.md#routing-and-data-fetching)

## When

- Editing, preview, or design library misbehaves

## Rules

- Check `context.preview` / `context.previewData` in `[[...path]].tsx`
- Verify editing routes: `src/pages/api/editing/config.ts`, `render.ts`

## Stop

- Escalate if platform/editor issue outside app code

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
