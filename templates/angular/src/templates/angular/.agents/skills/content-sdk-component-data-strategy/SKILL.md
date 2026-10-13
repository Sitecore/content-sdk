---
name: content-sdk-component-data-strategy
description: How a component receives Sitecore data — route resolve data, SitecoreContextService, placeholder inputs.
---

# Component data strategy (Angular)

**Detail:** [AGENTS-loaders-and-di.md#how-data-reaches-components](../../docs/AGENTS-loaders-and-di.md#how-data-reaches-components)
**Read first:** `src/app/pages/page.component.ts`, `src/app/shared/layout.component.ts`

## When

- Deciding how a component gets its Sitecore data
- Data is present on SSR but missing after a client-side navigation

## Rules

- Mapped components receive `fields` / `params` / `rendering` from `<sc-placeholder>` — do not fetch inside them
- Page-level data comes from route resolve data (`route.data['page']`, `['dictionary']`), read with `toSignal()` as in `PageComponent`
- For reactive access anywhere in the tree, inject `SitecoreContextService` (`page()`, `dictionary()`, `isEditing`, `effectiveLocale`)
- New page-level data means a new loader, not a component-level fetch
- Loader results must be JSON-serializable — they cross `TransferState` on first paint and `POST /_data` on navigation

## Stop

- Stop if introducing a second data-fetch path (component-level `HttpClient` for layout data) without clear need

Docs: [Content SDK for Angular](https://doc.sitecore.com/sai/en/developers/content-sdk/angular/10/sitecore-content-sdk-for-angular.html).
