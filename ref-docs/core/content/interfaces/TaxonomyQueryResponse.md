[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / TaxonomyQueryResponse

# Interface: TaxonomyQueryResponse

Defined in: [packages/core/src/content/taxonomies.ts:65](https://github.com/Sitecore/content-sdk/blob/b35860e173c4258c981f546aecdc086cd4c5f56d/packages/core/src/content/taxonomies.ts#L65)

Represents the response structure for a query that retrieves a specific taxonomy by ID.

## Properties

### taxonomy

> **taxonomy**: `object`

Defined in: [packages/core/src/content/taxonomies.ts:67](https://github.com/Sitecore/content-sdk/blob/b35860e173c4258c981f546aecdc086cd4c5f56d/packages/core/src/content/taxonomies.ts#L67)

The retrieved taxonomy.

#### system

> **system**: [`TaxonomySystem`](../type-aliases/TaxonomySystem.md)

The system metadata of the taxonomy.

#### terms

> **terms**: `object`

The terms for the taxonomy (may be paginated).

##### terms.cursor?

> `optional` **cursor**: `null` \| `string`

##### terms.hasMore

> **hasMore**: `boolean`

##### terms.results

> **results**: [`Term`](../type-aliases/Term.md)[]
