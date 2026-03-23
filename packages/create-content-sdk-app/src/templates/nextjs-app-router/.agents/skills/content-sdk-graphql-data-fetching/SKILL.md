---
name: content-sdk-graphql-data-fetching
description: Page and dictionary fetching via the single Sitecore client in src/lib/sitecore-client.ts. App Router: getPage(path ?? [], { site, locale }), getDictionary, getAppRouterStaticParams for SSG; preview uses draftMode() and getPreview/getDesignLibraryData from searchParams. Use when fetching page or dictionary content.
---

# Data fetching (App Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — Catch-all page, `generateStaticParams`, metadata.

## When

- `getPage`, `getDictionary`, static params, preview, or metadata from Sitecore.

## Rules

- Use only `src/lib/sitecore-client.ts`. `await params` (Next 15+); pass `{ site, locale }` into `getPage` / dictionary calls.
- At the top of content pages, call `setRequestLocale` with the template `` `${site}_${locale}` `` (see AGENTS.md).
- SSG: `getAppRouterStaticParams(sites, routing.locales)`; preview via `draftMode` + search params.

## Stop

- Do not create a second client or fetch layout data in client components when SSR/RSC is intended.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
