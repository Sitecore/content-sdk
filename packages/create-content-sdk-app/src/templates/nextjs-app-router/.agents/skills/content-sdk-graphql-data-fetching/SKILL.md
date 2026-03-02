---
name: content-sdk-graphql-data-fetching
description: Fetches page data and dictionary via the single Sitecore client. App Router: getPage(path ?? [], { site, locale }), getDictionary, getAppRouterStaticParams; for preview use draftMode() and getPreview/getDesignLibraryData from searchParams. Use when fetching page or dictionary content.
---

# Content SDK GraphQL Data Fetching (App Router)

All Sitecore data fetching goes through the single client in `src/lib/sitecore-client.ts`. Use getPage, getDictionary, and related methods correctly. This app does **not** use getComponentData; layout data comes from getPage.

## When to Use

- User asks how to fetch page data, layout, or dictionary phrases.
- Task involves getPage, getDictionary, getErrorPage, getPreview, getDesignLibraryData, or getAppRouterStaticParams.
- User mentions "sitecore client," "Layout Service," "page data," or "dictionary."

## How to perform

- Use the client from `src/lib/sitecore-client.ts` only. In the catch-all page: `await params`, then `client.getPage(path ?? [], { site, locale })`. For SSG use `generateStaticParams` and `client.getAppRouterStaticParams(siteNames, locales)`. For preview use `draftMode()` and `getPreview`/`getDesignLibraryData` from searchParams.

## Hard Rules

- Use the single SitecoreClient instance in `src/lib/sitecore-client.ts`. Do not create a second client or instantiate SitecoreClient elsewhere.
- Pass **site** and **locale** from route params (e.g. `await params` in the page). Do not rely on global state for site/locale in server code.
- **Catch-all page:** `client.getPage(path ?? [], { site, locale })`. Params are a Promise (Next.js 15+); use `await params` to get `{ site, locale, path? }`.
- **Preview:** Use `draftMode()`; if `draft.isEnabled`, use `client.getPreview(editingParams)` or `client.getDesignLibraryData(editingParams)` from **searchParams**. Otherwise use getPage with site and locale.
- **SSG:** `generateStaticParams` — use `client.getAppRouterStaticParams(siteNames, locales)` where site names come from `.sitecore/sites.json` (e.g. `sites.map((s) => s.name)`), locales from `src/i18n/routing.ts` (e.g. `routing.locales.slice()`). Return at least one default param when not generating full paths (e.g. `{ site, locale, path: [] }`).
- Config for the client comes from `sitecore.config.ts`; use environment variables, never hardcode secrets.

## Stop Conditions

- Stop if the task requires moving the client to another folder without clear requirement; suggest keeping a single instance in lib.
- Do not add direct GraphQL or fetch to Layout Service bypassing the client unless the task explicitly requires it.

## References

- [AGENTS.md](../../../AGENTS.md) for SitecoreClient, getPage, getDictionary, and SSG.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
