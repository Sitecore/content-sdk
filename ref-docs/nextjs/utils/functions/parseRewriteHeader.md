[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [utils](../README.md) / parseRewriteHeader

# Function: parseRewriteHeader()

> **parseRewriteHeader**(`headers`): `object`

Defined in: [nextjs/src/utils/utils.ts:73](https://github.com/Sitecore/content-sdk/blob/6f1f574e232c16ea3b3b0aca917e03c8b56b437b/packages/nextjs/src/utils/utils.ts#L73)

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
