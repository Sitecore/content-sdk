[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [lib](../README.md) / SitecoreContextService

# Class: SitecoreContextService

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:45](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/lib/sitecore-context.service.ts#L45)

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

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:50](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/lib/sitecore-context.service.ts#L50)

Current Sitecore dictionary data.

***

### editingRendering

> `readonly` **editingRendering**: `Signal`\<`ComponentRendering`\<`ComponentFields`\> \| `null`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:73](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/lib/sitecore-context.service.ts#L73)

The rendering placed in the Design Library editing placeholder, or `null` when absent.

***

### effectiveLocale

> `readonly` **effectiveLocale**: `Signal`\<`string`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:93](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/lib/sitecore-context.service.ts#L93)

Effective locale for data fetching: `page.locale ?? urlLocale ?? defaultLanguage`.

***

### isDesignLibrary

> `readonly` **isDesignLibrary**: `Signal`\<`boolean`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:61](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/lib/sitecore-context.service.ts#L61)

Whether the current page is in Design Library mode.

***

### isEditing

> `readonly` **isEditing**: `Signal`\<`boolean`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:55](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/lib/sitecore-context.service.ts#L55)

Whether the current page is in editing mode.

***

### isPreview

> `readonly` **isPreview**: `Signal`\<`boolean`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:58](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/lib/sitecore-context.service.ts#L58)

Whether the current page is in preview mode.

***

### isVariantGeneration

> `readonly` **isVariantGeneration**: `Signal`\<`boolean`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:66](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/lib/sitecore-context.service.ts#L66)

Whether the current Design Library page is in variant-generation mode.

***

### page

> `readonly` **page**: `Signal`\<`Page` \| `null`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:47](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/lib/sitecore-context.service.ts#L47)

Current Sitecore page data (layout + mode).

***

### urlLocale

> `readonly` **urlLocale**: `Signal`\<`string` \| `null`\>

Defined in: [packages/angular/src/lib/sitecore-context.service.ts:83](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/angular/src/lib/sitecore-context.service.ts#L83)

Locale extracted from the current URL; `null` when no configured-locale prefix
or when locales are not configured.
