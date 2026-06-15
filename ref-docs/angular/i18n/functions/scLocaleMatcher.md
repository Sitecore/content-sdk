[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [i18n](../README.md) / scLocaleMatcher

# Function: scLocaleMatcher()

> **scLocaleMatcher**(`locales`): [`UrlMatcher`](https://angular.dev/api/router/UrlMatcher)

Defined in: [packages/angular/src/i18n/locale-utils.ts:54](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/i18n/locale-utils.ts#L54)

Creates an Angular [UrlMatcher](https://angular.dev/api/router/UrlMatcher) that consumes a configured-locale segment from
the start of a route. When the first URL segment matches one of scConfig's `locales`, it is consumed
and exposed as the `locale` route param. Otherwise zero segments are consumed and the
route still matches (so error routes and the catchall handle both prefixed and unprefixed
URLs from the same route tree).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `locales` | `string`[] | Configured locales. |

## Returns

[`UrlMatcher`](https://angular.dev/api/router/UrlMatcher)

Angular URL matcher for locale-prefixed route trees.
