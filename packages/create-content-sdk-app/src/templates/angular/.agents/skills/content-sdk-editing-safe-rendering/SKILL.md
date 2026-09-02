---
name: content-sdk-editing-safe-rendering
description: Metadata-mode editing and preview via getEditingPreviewData in the page loader and sc-editing-scripts.
---

# Editing-safe rendering (Angular)

**Detail:** [AGENTS-key-concepts.md#editing-and-preview](../../docs/AGENTS-key-concepts.md#editing-and-preview)
**Read first:** `src/content-sdk/loaders/page.loader.ts`, `src/app/app.html`

## When

- Editing or preview broken
- Component must work in Sitecore Pages or the Design Library

## Rules

- Editing is **Metadata mode only** — there is no Experience Editor chrome support
- Preview payload arrives on the same Express `req`; read it with `getEditingPreviewData(context.csdkRequestData)` in the loader, then `getClient().getPreview()` or `getDesignLibraryData()` when `isDesignLibraryPreviewData()`
- `<sc-editing-scripts />` stays as the first element of `src/app/app.html`
- Render editable fields through the `*sc*` directives so the `<code class="scpm">` markers are emitted
- Branch on `page.mode.isEditing` / `.isPreview` / `.isNormal` / `.isDesignLibrary`, not on env checks
- The loader cache is bypassed for editing requests — do not add caching that ignores that

## Stop

- Stop if a change would break the editing endpoints in `src/server.ts` or remove editing metadata from fields

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
