---
name: content-sdk-graphql-data-fetching
description: Page/dictionary fetch via getClient() inside src/content-sdk/loaders; no HttpClient for layout data.
---

# Data fetching (Angular)

**Detail:** [AGENTS-loaders-and-di.md#the-loaderfn-contract](../../docs/AGENTS-loaders-and-di.md#the-loaderfn-contract)
**Read first:** `src/content-sdk/loaders/page.loader.ts`, `src/content-sdk/client/sitecore-client.ts`

## When

- Fetching page or dictionary data
- Preview / Design Library data
- A component needs additional Sitecore content

## Rules

- All Sitecore data enters through loaders — never `HttpClient` in a component for layout data
- One client: `getClient()` lazy singleton; do not call `new SitecoreClient(...)` elsewhere
- Path from `splitLocaleFromPath(context.url, scConfig.angular.locales).nonLocalePath`; locale from `getLanguage(context)`; site from `getSiteName(context)`
- `getClient().getPage(path, { locale, site, personalize })`; dictionary via `getClient().getDictionary({ locale, site })`
- Preview: `getEditingPreviewData(context.csdkRequestData)` → `getPreview()` or `getDesignLibraryData()`

## Stop

- Stop if fetching Sitecore layout client-side when the loader path is intended
- Stop if the fetch would need Angular DI inside the loader body

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
