[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [i18n](../README.md) / splitLocaleFromPath

# Function: splitLocaleFromPath()

> **splitLocaleFromPath**(`pathname`, `locales`): [`LocaleExtractionResult`](../interfaces/LocaleExtractionResult.md)

Defined in: [packages/angular/src/i18n/locale-utils.ts:30](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/angular/src/i18n/locale-utils.ts#L30)

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
