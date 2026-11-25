[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / parseRewriteHeader

# Function: parseRewriteHeader()

> **parseRewriteHeader**(`headers`): `object`

Defined in: [nextjs/src/utils/utils.ts:120](https://github.com/Sitecore/content-sdk/blob/11719c29a76964a5138c9b66c4ad7c2c94a0da6d/packages/nextjs/src/utils/utils.ts#L120)

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
