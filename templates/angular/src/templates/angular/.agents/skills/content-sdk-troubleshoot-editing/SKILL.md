---
name: content-sdk-troubleshoot-editing
description: Debug Angular editing — editing middleware order, /api/editing/config, preview payload, component map keys.
---

# Troubleshoot editing (Angular)

**Detail:** [AGENTS-key-concepts.md#editing-and-preview](../../docs/AGENTS-key-concepts.md#editing-and-preview)
**Read first:** `src/server.ts`, `src/content-sdk/loaders/page.loader.ts`

## When

- Editing, preview, or Design Library misbehaves
- Pages shows stale content or an empty placeholder in the editor

## Rules

- Check middleware order: `createEditingConfigMiddleware`, `createExperimentalFeaturesMiddleware` and `createEditingRenderMiddleware` must be registered **before** `express.static` and the SSR handler
- Verify `/api/editing/config` returns the expected component names and `editMode: 'metadata'`; missing names usually mean a stale `.sitecore/component-map.ts`
- Verify `SITECORE_EDITING_SECRET` is set on the server (a missing value falls back to a placeholder and the render request is rejected)
- Confirm `getEditingPreviewData(context.csdkRequestData)` is reached in `pageLoader` — if it is not, the request never went through the editing render middleware
- Stale content in the editor points at the loader cache; editing requests are supposed to bypass it
- Fields not editable usually means interpolation was used instead of an `*sc*` directive

## Stop

- Escalate if the problem is in the Pages editor or the platform rather than app code

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
