# Editor integration (metadata, Pages Router)

Official: [Editor integration using metadata](https://doc.sitecore.com/sai/en/developers/content-sdk/20/editor-integration-using-metadata.html). Raw: `llm-wiki/raw/2026-05-14-editor-integration-using-metadata.md`.

**Scope:** Next.js **Pages Router** or **App Router** + SitecoreAI **Page builder** — metadata on placeholders, renderings, fields for visual editing.

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

## CORS (editing API routes)

Sitecore **Pages editor** run on fixed **Sitecore cloud origins** and may call your app’s **`/api/editing/*`** routes from the browser. Those requests are **cross-origin**, so the editing handlers must validate the request’s **`Origin`** and return appropriate **`Access-Control-*`** headers (including **`OPTIONS`** preflight).

### Default allowed origins

The SDK ships a built-in list used for every editing handler that calls **`getEnforcedCorsHeaders`** with **`allowedOrigins: EDITING_ALLOWED_ORIGINS`**:

```39:44:packages/content/src/editing/utils.ts
export const EDITING_ALLOWED_ORIGINS = [
  'https://pages.sitecorecloud.io',
  'https://xmapps.sitecorecloud.io',
  'https://designlibrary.sitecorecloud.io',
  'https://app.sitecorecloud.io',
];
```
Custom **`JSS_ALLOWED_ORIGINS`** env needs to be set when connecting to staging or dev Sitecore AI deployments with non-default hostname.

### `getEnforcedCorsHeaders` (`@sitecore-content-sdk/core/tools`)

Implementation: **`packages/core/src/tools/utils.ts`**. It:

1. Reads the request **`Origin`** header (supports both Node **`IncomingHttpHeaders`** and Fetch **`Headers`**).
2. Builds the effective allowlist from **three** sources (concatenated): **`JSS_ALLOWED_ORIGINS`** (comma-separated env list, spaces stripped), the **`allowedOrigins`** argument (above defaults), and an optional **`presetCorsHeader`** (e.g. an origin already set by Next config).
3. Accepts the request if **`Origin`** equals an entry **or** matches an entry treated as a **wildcard pattern** (`*` → `.*` in a regex anchored to the full string).
4. On success, returns headers including **`Access-Control-Allow-Origin`** set to the **request’s** `Origin` (echo), **`Access-Control-Allow-Methods`**: `GET, POST, OPTIONS, DELETE, PUT, PATCH`, **`x-middleware-cache`**: `no-cache`, **`Cache-Control`**: `no-store, must-revalidate`. For **`OPTIONS`**, it also adds **`Access-Control-Allow-Headers`**: `Content-Type, Authorization`.
5. If **`Origin`** is present but **not** allowed, returns **`null`** (callers respond with **401** and an HTML/plain message that the origin is not allowed). Debug logs mention **`JSS_ALLOWED_ORIGINS`** for operators extending the allowlist.
6. If there is **no** `Origin` header, the helper returns **`{}`** (empty object). Callers treat that as “no CORS failure from this check” but typically **do not** emit `Access-Control-Allow-*` from this path—same-origin or non-browser callers often have no `Origin`.

### Where it is applied (Next.js)

| Surface | Behavior |
|---------|----------|
| **`EditingRenderMiddleware`** (Pages API) | CORS checked **before** editing secret; **`OPTIONS`** → **204** with CORS headers; invalid origin → **401** JSON/html. |
| **`EditingConfigMiddleware`** | Same pattern: CORS first, then secret, then **`OPTIONS`** **204**. |
| **`FEAASRenderMiddleware`** | Same for **`/api/editing/feaas/render`** (**GET** / **OPTIONS** only after CORS). |
| **App Router** `createEditingRenderRouteHandlers` | **`GET`** / **`OPTIONS`** use the same **`getEnforcedCorsHeaders`** helper. **`POST`** (Design Library server-action proxy): CORS may be **bypassed** when the request target is **`localhost`** or **same host** as the request `Origin` (e.g. some Vercel/Netlify setups); otherwise invalid origin → **401**. Successful responses still merge CORS headers into the proxied response where applicable. |

Operational note: set **`JSS_ALLOWED_ORIGINS`** (comma-separated origins, optional `*` wildcards per segment) when editors or previews hit your app from hosts **outside** the default Sitecore cloud list (e.g. custom staging URLs).

## CSP / iframes

Strict **`X-Frame-Options`** or **`frame-ancestors 'self'`** breaks Pages iframe — allow the Pages host.

## Code

- `packages/core/src/tools/utils.ts` — **`getEnforcedCorsHeaders`**, **`getAllowedOriginsFromEnv`**
- `packages/content/src/editing/utils.ts` — **`EDITING_ALLOWED_ORIGINS`**
- `packages/nextjs/src/editing/editing-render-middleware.ts`, `editing-config-middleware.ts`, `feaas-render-middleware.ts`, `editing/utils.ts` (CSP helpers)
- `packages/nextjs/src/route-handler/editing-render-route-handler.ts`, `editing-config-route-handler.ts` — App Router handlers

## Related

- [doc-page-composition-placeholders.md](doc-page-composition-placeholders.md)
- [doc-terminology-platform-names.md](../common/doc-terminology-platform-names.md)
- [doc-example-environment-variable-files.md](doc-example-environment-variable-files.md) — add **`JSS_ALLOWED_ORIGINS`** to `.env` when extending editing CORS beyond defaults
