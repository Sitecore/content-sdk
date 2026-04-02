---
name: content-sdk-troubleshoot-editing
description: Troubleshoots XM Cloud editing, preview, and design library for App Router. Check draftMode(), searchParams, and editing API routes. Use when editing or preview does not behave as expected.
---

# Troubleshoot editing (App Router)

**Detail:** [AGENTS-router-specifics.md](../../docs/AGENTS-router-specifics.md#api-route-handlers); fixes with **content-sdk-editing-safe-rendering**.

## When

- Editor/preview/design library issues, missing chromes, wrong preview data.

## Rules

- Verify `draftMode`, searchParams → `getPreview` / `getDesignLibraryData`, both component maps, and `dynamic = 'force-dynamic'` on editing routes.
- Ensure matcher skips `/api` and env (`editingSecret`, API) is set and documented.

## Stop

- If root cause is XM Cloud project/CI, stop after listing required external changes.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
