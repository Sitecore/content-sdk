[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / parseRewriteHeader

# Function: parseRewriteHeader()

> **parseRewriteHeader**(`headers`): `object`

Defined in: [nextjs/src/utils/utils.ts:82](https://github.com/Sitecore/content-sdk/blob/2f14286ddbb524cc49993783ef29cc66d697e78d/packages/nextjs/src/utils/utils.ts#L82)

For App Router application, extracts the site and locale information from the rewrite header which is in format /[site]/[locale]/[...path].

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `headers` | `Headers` | The `Headers` object containing the rewrite header. |

## Returns

`object`

An object containing the `site` and `locale` extracted from the rewrite header.

### locale

> **locale**: `string`

### site

> **site**: `string`
