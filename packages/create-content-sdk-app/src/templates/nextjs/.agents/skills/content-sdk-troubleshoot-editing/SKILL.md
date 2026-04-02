---
name: content-sdk-troubleshoot-editing
description: Troubleshoots XM Cloud editing, preview, and design library for Pages Router. Check context.preview, context.previewData, and editing API routes (config, render, feaas/render). Use when editing or preview does not behave as expected.
---

# Troubleshoot editing (Pages Router)

**Detail:** [AGENTS-router-specifics.md](../../docs/AGENTS-router-specifics.md#api-routes); implement fixes with **content-sdk-editing-safe-rendering**.

## When

- Editor/preview/design library issues, missing chromes, wrong preview data.

## Rules

- Verify `extractPath` / `context.locale`, `context.preview` / `previewData`, and that editing API routes match component map entries.
- Ensure matcher skips `/api` correctly and env (`editingSecret`, API) is set and documented.

## Stop

- If root cause is XM Cloud project/CI, stop after listing required external changes.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
