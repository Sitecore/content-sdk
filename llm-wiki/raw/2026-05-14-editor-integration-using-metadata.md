---
title: Editor integration using metadata
source_url: https://doc.sitecore.com/sai/en/developers/content-sdk/20/editor-integration-using-metadata.html
doc_version: "2.x"
ingested: "2026-05-14"
fetch_note: "HTML retrieved via curl; body distilled to markdown (diagram omitted)."
---

# Editor integration using metadata (snapshot)

**Scope (official):** Next.js **Pages Router** apps + SitecoreAI **Page builder**, using **layout service metadata** on placeholders, renderings, and fields so the editor can identify nodes for **in-browser visual editing**.

**Stack (official):** [Sitecore Headless Services HTTP rendering engine](https://doc.sitecore.com/xp/en/developers/hd/22/sitecore-headless-development/http-rendering-engine.html), [Next.js API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes), [Next.js Preview Mode](https://nextjs.org/docs/pages/guides/preview-mode).

**Note:** Official diagram: teal = Content SDK for Next.js APIs; other colors = sample app pieces.

**Local Pages testing:** Connect [local host to Pages](https://doc.sitecore.com/xmc/en/developers/xm-cloud/connect-your-local-host-to-pages.html) (doc link uses XMC path; same platform family as SAI — see wiki `wiki/common/doc-terminology-platform-names.md`).

**Important — iframes:** `X-Frame-Options: SAMEORIGIN` or CSP `frame-ancestors 'self'` can **block** the Pages iframe. Allow the Pages domain to frame the editing host (adjust headers / exceptions).

## API routes (sample app)

1. **`src/pages/api/editing/render.ts`** — `GET`; **`EditingRenderMiddleware`**. Use this URL as **`serverSideRenderingEngineEndpointUrl`** in Sitecore Content SDK app configuration.
2. **`src/pages/api/editing/config.ts`** — `GET`; **`EditingConfigMiddleware`**.
3. **Catch-all page** **`src/pages/[[...path]].tsx`** — main optional catch-all; renders Sitecore routes.

## Editing secret

Token securing editor endpoints exposed via the **Render** API route. **`EditingRenderMiddleware`** validates it; failure → **401**.

## Next.js preview mode

Draft / Page builder content at **request time**, bypassing static generation when appropriate. **`EditingRenderMiddleware`** enables preview mode (cookies on render response, passed to subsequent page request). In the catch-all, use **`SitecoreClient.getPreview`** or **`getDesignLibraryData`** when in preview (vs normal **`getPage`**).

## Example render `GET` (metadata integration)

```
/api/editing/render?secret={EDITING_SECRET}&sc_site=nextjs-app&sc_itemid=54C8E9B5-0B2C-5363-8FA6-D32A3A302F51&sc_lang=en&route=/&mode=edit&sc_version=latest&sc_variant={VARIANT_ID}&sc_layoutKind=shared
```

- `sc_layoutKind`: enum, default **`final`**, optional **`shared`**.
- `sc_version`, `sc_variant`, `sc_layoutKind` — optional.

## SDK APIs

Import from **`@sitecore-content-sdk/nextjs/editing`**, e.g. `EditingRenderMiddleware`.

### EditingRenderMiddleware (responsibilities, per doc)

1. Validate editing secret.  
2. Extract required query string parameters.  
3. Enable Next.js preview mode; pass parameters as preview data.  
4. Send internal request to editing host catch-all to fetch the page.  
5. Return rendered page markup.

### EditingConfigMiddleware (responsibilities, per doc)

1. Validate editing secret.  
2. Provide required configuration (**application metadata**) for feature compatibility.

Full page: `source_url`.
