[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [lib](../README.md) / SitecoreContextService

# Class: SitecoreContextService

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:41](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/lib/sitecore-context.service.ts#L41)

Request-scoped Sitecore context derived reactively from the Angular Router.

- `page` / `dictionary` — from route resolve data (`loaderResolver('page'|'dictionary')`)
- `urlLocale` — from current pathname (SSR REQUEST / window.location, then NavigationEnd)
- `isEditing` / `effectiveLocale` — computed from page + urlLocale + config

No manual `setPage` / `setDictionary` / `setLocale` wiring required in app components.

## Constructors

### Constructor

> **new SitecoreContextService**(): `SitecoreContextService`

#### Returns

`SitecoreContextService`

## Properties

### dictionary

> `readonly` **dictionary**: `Signal`\<`DictionaryPhrases` \| `null`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:45](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/lib/sitecore-context.service.ts#L45)

Current Sitecore dictionary data.

***

### effectiveLocale

> `readonly` **effectiveLocale**: `Signal`\<`string`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:65](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/lib/sitecore-context.service.ts#L65)

Effective locale for data fetching: `page.locale ?? urlLocale ?? defaultLanguage`.

***

### isEditing

> `readonly` **isEditing**: `Signal`\<`boolean`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:49](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/lib/sitecore-context.service.ts#L49)

Whether the current page is in editing mode.

***

### isPreview

> `readonly` **isPreview**: `Signal`\<`boolean`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:51](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/lib/sitecore-context.service.ts#L51)

Whether the current page is in preview mode.

***

### page

> `readonly` **page**: `Signal`\<`Page` \| `null`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:43](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/lib/sitecore-context.service.ts#L43)

Current Sitecore page data (layout + mode).

***

### urlLocale

> `readonly` **urlLocale**: `Signal`\<`string` \| `null`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:56](https://github.com/Sitecore/content-sdk/blob/7630555e650297c3e5d511cfc4a94d6add6462b0/packages/angular/src/lib/sitecore-context.service.ts#L56)

Locale extracted from the current URL; `null` when no configured-locale prefix
or when locales are not configured.
