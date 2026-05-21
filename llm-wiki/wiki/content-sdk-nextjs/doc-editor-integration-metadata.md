# Editor integration (metadata, Pages Router)

Official: [Editor integration using metadata](https://doc.sitecore.com/sai/en/developers/content-sdk/20/editor-integration-using-metadata.html). Raw: `llm-wiki/raw/2026-05-14-editor-integration-using-metadata.md`.

**Scope:** Next.js **Pages Router** + SitecoreAI **Page builder** — metadata on placeholders, renderings, fields for visual editing.

## Head routes (template)

| Role | Path |
|------|------|
| Render | `src/pages/api/editing/render.ts` — **`EditingRenderMiddleware`** |
| Config / metadata | `src/pages/api/editing/config.ts` — **`EditingConfigMiddleware`** |
| FEaaS | `src/pages/api/editing/feaas/render.ts` — **`FEAASRenderMiddleware`** (template extra; `next.config.js` rewrite `/feaas-render` → API) |
| Page | `src/pages/[[...path]].tsx` — preview vs `getPage` — [doc-route-handling-data-fetching.md](doc-route-handling-data-fetching.md) |

## Editing secret

**`editingSecret`** / **`SITECORE_EDITING_SECRET`** — [doc-sitecore-config.md](doc-sitecore-config.md). Invalid `secret` on render route → **401**.

## Preview / editing flow (short)

1. Editor calls **`GET /api/editing/render?...`** (CORS, secret, required params).
2. **`EditingRenderMiddleware`** sets **Next preview data**, CSP, optional preview cookies for **`mode=preview`**, then **server fetch** of the catch-all route with preview cookies + **`x-sitecore-editing-params`** header + **`__content_sdk_preview`**.
3. Catch-all uses **`getPreview`** / **`getDesignLibraryData`** when `context.preview` is set — **`EditingService`** GraphQL with **`sc_editMode` / `sc_previewMode`** headers.

## CSP / iframes

Strict **`X-Frame-Options`** or **`frame-ancestors 'self'`** breaks Pages iframe — allow the Pages host.

## Code

- `packages/nextjs/src/editing/editing-render-middleware.ts`, `editing-config-middleware.ts`, `utils.ts`

## Related

- [doc-page-composition-placeholders.md](doc-page-composition-placeholders.md)
- [doc-terminology-platform-names.md](doc-terminology-platform-names.md)
