---
title: The Sitecore configuration file
source_url: https://doc.sitecore.com/sai/en/developers/content-sdk/20/the-sitecore-configuration-file.html
doc_version: "2.x"
ingested: "2026-05-14"
reingested: "2026-05-14"
fetch_status: ok
---

# The Sitecore configuration file (full snapshot)

**Version:** 2.x (per official topic)

Content SDK includes **`sitecore.config.ts`** at the **app root** — central configuration. Starter templates ship a **minimal** file; expand as needed.

**Import:**

```ts
import scConfig from 'sitecore.config';
```

**Env resolution:** Many properties have a **corresponding environment variable**. If a property has no explicit value, it falls back to the env var when present; otherwise **defaults** in the config layer apply.

---

## The base configuration

| Property | Type | Description | Env var |
|----------|------|-------------|---------|
| `api` | object | Connection credentials for SitecoreAI (provide **`edge`** or **`local`**, not both) | n/a |
| `defaultSite` | string | If **multisite** enabled: fallback site. If multisite **off**: site for visitors. Default `''`. | `NEXT_PUBLIC_DEFAULT_SITE_NAME` |
| `defaultLanguage` | string (optional) | Default locale fallback (API, site resolution, middleware, etc.). Must align with framework i18n (e.g. Next.js). Default `'en'`. | `NEXT_PUBLIC_DEFAULT_LANGUAGE` |
| `editingSecret` | string (optional) | Secret for SitecoreAI **editing and preview** when the app is an editing host. Default `'editing-secret-missing'`. | `SITECORE_EDITING_SECRET` |

### `api` — choose one

| Branch | Use |
|--------|-----|
| `edge` | SaaS SitecoreAI |
| `local` | Local SitecoreAI in Docker |

#### `api.edge`

| Property | Type | Description | Env var |
|----------|------|-------------|---------|
| `contextId` | string | Connect / retrieve data. Default `''`. | Server: `SITECORE_EDGE_CONTEXT_ID`. Client / server fallback: `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` |
| `clientContextId` | string (optional) | Client-side operations. Default `''`. | `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID` |
| `edgeUrl` | string (optional) | SitecoreAI endpoint URL. Default `https://edge-platform.sitecorecloud.io` | `NEXT_PUBLIC_SITECORE_EDGE_URL` |

#### `api.local`

| Property | Type | Description | Env var |
|----------|------|-------------|---------|
| `apiKey` | string | API key for GraphQL. Default `''`. | `NEXT_PUBLIC_SITECORE_API_KEY` |
| `apiHost` | string | API hostname. Default `''`. | `NEXT_PUBLIC_SITECORE_API_HOST` |
| `path` | string (optional) | Path appended to `apiHost` for full GraphQL URL. Default `/sitecore/api/graph/edge` | n/a |

---

## Services configuration

| Property | Purpose |
|----------|---------|
| `layout` | Extra **layout service** settings |
| `dictionary` | Extra **dictionary service** settings |
| `retries` | Retry behavior for **layout**, **dictionary**, and **ErrorPages** by default (on by default for Edge stability) |

### `layout`

| Property | Type | Description | Env |
|----------|------|-------------|-----|
| `formatLayoutQuery` | function (optional) | Args: `siteName`, `itemPath`, `locale` — returns first segment of layout GraphQL query. Default format: `layout(site:"${siteName}", routePath:"${itemPath}", language:"${language}")` | n/a |

### `dictionary` → `caching`

| Property | Type | Description | Env |
|----------|------|-------------|-----|
| `enabled` | boolean (optional) | Memory cache for dictionary. Default `true` | n/a |
| `timeout` | number (optional) | Cache TTL seconds. Default `60` | n/a |

### `retries`

| Property | Type | Description | Env |
|----------|------|-------------|-----|
| `count` | number (optional) | Max GraphQL retries; `0` disables. Default `3` | n/a |
| `retryStrategy` | `RetryStrategy` (optional) | From `@sitecore-content-sdk/nextjs/client`. Default **`DefaultRetryStrategy`**: exponential backoff factor **2** for **429, 502, 503, 504, 520–524** | n/a |

---

## Extra middleware and other configurations

*(Doc: oriented to Next.js middleware; other frameworks may differ.)*

### `redirects`

| Property | Type | Description | Env |
|----------|------|-------------|-----|
| `enabled` | boolean (optional) | Global redirects. Default **`true`** production, **`false`** development | n/a |
| `locales` | string[] (optional) | Locales for redirect strategy; must match app i18n (e.g. `next.config`). Default `['en']` | n/a |

**Important (official):** SitecoreAI does **not** support redirect **items** — only **redirect maps**.

### `multisite`

| Property | Type | Description | Env |
|----------|------|-------------|-----|
| `enabled` | boolean (optional) | Multisite for normal rendering. **Preview mode: multisite always on.** Default `true` | n/a |
| `useCookieResolution` | function (optional) | `req: RequestInit` → optionally resolve site from **`sc_site`** cookie. Default **`true`** on Vercel preview, else **`false`** | n/a |

### `personalize`

| Property | Type | Description | Env |
|----------|------|-------------|-----|
| `enabled` | boolean (optional) | Personalize feature. Default **`true`** prod, **`false`** dev | n/a |
| `edgeTimeout` | number (optional) | Edge personalization timeout (seconds). Default `400` | `PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT` |
| `cdpTimeout` | number (optional) | CDP timeout (seconds). Default `400` | `PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT` |
| `scope` | string (optional) | Personalize scope between environments. Default `''` | `NEXT_PUBLIC_PERSONALIZE_SCOPE` |
| `channel` | string (optional) | CDP channel. Default `WEB` | n/a |
| `currency` | string (optional) | CDP currency. Default `USD` | n/a |

### Other

| Property | Type | Description | Env |
|----------|------|-------------|-----|
| `generateStaticPaths` | boolean (optional) | Next.js: whether **`getStaticPaths`** pre-renders paths. **`false`** → ISR for all pages; use **`false`** when app is SitecoreAI **editing host**. Default `true` | `GENERATE_STATIC_PATHS` |
| `disableCodeGeneration` | boolean (optional) | Skip AI component generation / code extraction when `true` | n/a |
| `sitecoreInternalEditingHostUrl` | string (optional) | Internal URL for editing render scenarios (non-standard local setups). SDK **1.1+**. Default: SitecoreAI deploys → `http://localhost:3000`; else **request Host** | `SITECORE_INTERNAL_EDITING_HOST_URL` |

---

Canonical page: `source_url`.
