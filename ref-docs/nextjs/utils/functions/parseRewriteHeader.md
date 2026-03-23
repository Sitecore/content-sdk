[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / parseRewriteHeader

# Function: parseRewriteHeader()

> **parseRewriteHeader**(`headers`): `object`

Defined in: [nextjs/src/utils/utils.ts:82](https://github.com/Sitecore/content-sdk/blob/13f1347930830c53c628f3a82680e058ba95d5e0/packages/nextjs/src/utils/utils.ts#L82)

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
