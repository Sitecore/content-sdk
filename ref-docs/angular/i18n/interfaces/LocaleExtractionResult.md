[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [i18n](../README.md) / LocaleExtractionResult

# Interface: LocaleExtractionResult

Defined in: [packages/angular/src/i18n/locale-utils.ts:7](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/angular/src/i18n/locale-utils.ts#L7)

Result of locale extraction from a URL path.

## Properties

### locale

> **locale**: `string` \| `null`

Defined in: [packages/angular/src/i18n/locale-utils.ts:9](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/angular/src/i18n/locale-utils.ts#L9)

Configured locale found at the start of the path, or `null` when absent.

***

### nonLocalePath

> **nonLocalePath**: `string`

Defined in: [packages/angular/src/i18n/locale-utils.ts:11](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/angular/src/i18n/locale-utils.ts#L11)

Remainder of the path after the locale segment (always starts with `/`).

***

### queryFragment?

> `optional` **queryFragment?**: `string`

Defined in: [packages/angular/src/i18n/locale-utils.ts:13](https://github.com/Sitecore/content-sdk/blob/f3401a8f88338ab1fd34e5ea98096e167973633a/packages/angular/src/i18n/locale-utils.ts#L13)

Query or fragment string found at the end of the path, or `null` when absent.
