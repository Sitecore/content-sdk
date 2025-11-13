[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / TaxonomiesQueryResponse

# Interface: TaxonomiesQueryResponse

Defined in: [packages/core/src/content/taxonomies.ts:82](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/taxonomies.ts#L82)

Represents the response structure for a query that retrieves multiple taxonomies.

## Properties

### manyTaxonomy

> **manyTaxonomy**: `object`

Defined in: [packages/core/src/content/taxonomies.ts:84](https://github.com/Sitecore/content-sdk/blob/2679db118be36890cde6af8a829cbb154334f57d/packages/core/src/content/taxonomies.ts#L84)

The list of retrieved taxonomies, with pagination metadata.

#### cursor?

> `optional` **cursor**: `string`

The cursor for fetching the next page of taxonomies, if available.

#### hasMore

> **hasMore**: `boolean`

Indicates whether more taxonomies are available after the current page.

#### results

> **results**: `object`[]

The list of taxonomies in the current page.
