[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [i18n](../README.md) / SitecoreTranslateLoader

# Class: SitecoreTranslateLoader

Defined in: [packages/angular/src/i18n/sitecore-translate-loader.ts:14](https://github.com/Sitecore/content-sdk/blob/fbd07f45d77bcc00772e33d09bde850e688b09b2/packages/angular/src/i18n/sitecore-translate-loader.ts#L14)

`ngx-translate` loader using Sitecore dictionary from [SitecoreContextService](../../lib/classes/SitecoreContextService.md).
Requires a `dictionaryLoader` resolver on the active route — without it, `dictionary()`
is `null` and translations resolve to `{}`.

## Implements

- `TranslateLoader`

## Constructors

### Constructor

> **new SitecoreTranslateLoader**(): `SitecoreTranslateLoader`

#### Returns

`SitecoreTranslateLoader`

## Methods

### getTranslation()

> **getTranslation**(): `Observable`\<`Record`\<`string`, `string`\>\>

Defined in: [packages/angular/src/i18n/sitecore-translate-loader.ts:21](https://github.com/Sitecore/content-sdk/blob/fbd07f45d77bcc00772e33d09bde850e688b09b2/packages/angular/src/i18n/sitecore-translate-loader.ts#L21)

Returns the translation based on the dictionary in the context from [SitecoreContextService](../../lib/classes/SitecoreContextService.md).

#### Returns

`Observable`\<`Record`\<`string`, `string`\>\>

Observable of translation dictionary.

#### Implementation of

`TranslateLoader.getTranslation`
