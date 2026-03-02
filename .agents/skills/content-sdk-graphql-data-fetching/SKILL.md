---
name: content-sdk-graphql-data-fetching
description: Fetches page data, layout, and dictionary via the Sitecore client (Layout Service, getPage, getDictionary). Use when fetching page or dictionary content, wiring data to pages, or when the user mentions getPage, getDictionary, Layout Service, or sitecore-client.
---

# Content SDK GraphQL Data Fetching

All Sitecore data fetching goes through a single client instance; use getPage, getDictionary, and related methods correctly.

## When to Use

- User asks how to fetch page data, layout, or dictionary phrases.
- Task involves getPage, getDictionary, getErrorPage, getPreview, getDesignLibraryData, getPagePaths, or getAppRouterStaticParams.
- User mentions "sitecore client," "Layout Service," "page data," or "dictionary."

## Hard Rules

- Use a single SitecoreClient instance for the app (e.g. `src/lib/sitecore-client.ts`). Do not create a second client or instantiate SitecoreClient elsewhere for normal data fetching.
- Pass site and locale from the request/route (e.g. route params in App Router, or context.locale in Pages Router); do not rely on global state for site/locale in server code.
- **App Router:** In the catch-all page, use `client.getPage(path ?? [], { site, locale })`; for preview use `draftMode()` and `client.getPreview(editingParams)` or `client.getDesignLibraryData(editingParams)` from searchParams. For SSG use `client.getAppRouterStaticParams(sites, routing.locales)`.
- **Pages Router:** Use `client.getPage(path, { locale: context.locale })`, then `client.getDictionary({ site: page.siteName, locale: page.locale })` and `client.getComponentData(page.layout, context, components)` as needed. Path from `extractPath(context)`; for SSG paths use `client.getPagePaths(sites, context?.locales)`.
- Config for the client comes from `sitecore.config.ts`; use environment variables, never hardcode secrets.

## Stop Conditions

- Stop if the task requires changing where the client is created (e.g. moving from lib to another folder) without clear requirement; suggest keeping a single instance.
- Stop if site or locale source is ambiguous (e.g. App Router vs Pages Router); confirm which app type and use the correct pattern.
- Do not add new GraphQL calls or direct fetch to Layout Service bypassing the client unless the task explicitly requires it.

## References

- Template AGENTS.md (nextjs-app-router or nextjs) for SitecoreClient location, getPage/getDictionary flow, and SSG/SSR.
- [AGENTS.md](../../../AGENTS.md) for monorepo package (content, nextjs) when changing SDK code.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
