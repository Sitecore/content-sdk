[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [i18n](../README.md) / splitLocaleFromPath

# Function: splitLocaleFromPath()

> **splitLocaleFromPath**(`pathname`, `locales`): [`LocaleExtractionResult`](../interfaces/LocaleExtractionResult.md)

Defined in: [packages/angular/src/i18n/locale-utils.ts:30](https://github.com/Sitecore/content-sdk/blob/cc697f1b79c7ea3d0da73c83f919cdbb67d0d0c9/packages/angular/src/i18n/locale-utils.ts#L30)

Extracts a configured locale from the first segment of a URL pathname.
Returns `{ locale: null, nonLocalePath: pathname, queryFragment: query or fragment string }` when the first segment is not a configured locale.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `pathname` | `string` | URL pathname, with or without leading `/`. |
| `locales` | `string`[] | Configured locales. |

## Returns

[`LocaleExtractionResult`](../interfaces/LocaleExtractionResult.md)

Detected locale and the rest of the path.
