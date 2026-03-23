---
name: content-sdk-graphql-data-fetching
description: Fetches page, dictionary, and component data via the single Sitecore client. Pages Router: getPage(path, { locale: context.locale }), getDictionary({ site: page.siteName, locale: page.locale }), getComponentData(page.layout, context, components); for SSG use getPagePaths(sites, context?.locales). Use when fetching page or dictionary content.
---

# Data fetching (Pages Router)

**Detail:** [AGENTS.md](../../../AGENTS.md) — SitecoreClient, catch-all route, SSG/SSR/preview.

## When

- `getPage`, `getDictionary`, `getComponentData`, `getPreview`, `getPagePaths`, or “how do I fetch…?”

## Rules

- Use only `src/lib/sitecore-client.ts`. Path = `extractPath(context)`; locale = `context.locale`.
- Order: `getPage` → `getDictionary` → `getComponentData`; no Sitecore fetch in `_app`.
- SSG: `getPagePaths` from `.sitecore/sites.json` names; preview uses `context.preview` / `previewData`.

## Stop

- Do not add a second `SitecoreClient` or bypass the client with raw GraphQL unless explicitly required.

Docs: [Content SDK](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
