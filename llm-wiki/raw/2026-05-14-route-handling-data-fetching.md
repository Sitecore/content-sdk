---
title: Route handling and data fetching in Content SDK apps
source_url: https://doc.sitecore.com/sai/en/developers/content-sdk/20/route-handling-and-data-fetching-in-content-sdk-apps.html
doc_version: "2.x"
ingested: "2026-05-14"
reingested: "2026-05-14"
fetch_status: ok
---

# Route handling and data fetching (snapshot)

## Content tree → URLs (SitecoreAI)

Each page is a **content item**; tree structure defines **URL structure** (authors control URLs by hierarchy). Example: `site-1/Home/About`, `site-1/Home/Products/Item-1` → `/about`, `/products/item-1` on `site-1` hostname.

Content SDK apps are expected to **fully support** SitecoreAI URL mapping.

**Note:** Hostname and URL mapping rules are configured in Sitecore (site definitions, URL rewrite); custom routing needs front-end + Sitecore coordination. Prefer hierarchical routes (e.g. `/products/shoes/running`).

## Route resolution (Next.js)

Next.js uses **file-system routing** and **catch-all** routes. A **custom route resolver** maps incoming paths to Sitecore content items.

## Data fetching flow (example `/products/item-1`)

1. User navigates to `/products/item-1`.
2. Route resolver maps path → Sitecore route.
3. **GraphQL** to Edge (or Preview) API — official doc example host pattern: `https://edge-platform.sitecorecloud.io/v1/content/api/graphql/v1?sitecoreContextId=...` (actual URL comes from app **sitecore.config** / Edge settings).
4. Query returns: **route layout**, **component fields**, **context** (language, site, …).
5. Data passed to rendering (**Placeholders**, **Components**).

**Documentation note:** The official page links `LayoutService` to `packages/core/src/layout/layout-service.ts` on GitHub; in **this** repo the implementation lives under **`packages/content/src/layout/layout-service.ts`** (see wiki `doc-route-handling-data-fetching.md`).

## Display name–based routing (Content SDK 1.1+)

URLs can derive from item **display name** instead of item **name**. Sitemaps for display-name routes may require a **Sitecore patch** (`linkManager` / `useDisplayName="true"`), redeploy, then Sitemap settings → link provider name. After patch, sitemaps may **only** include display-name routes (per official warning).

Full page: `source_url`.
