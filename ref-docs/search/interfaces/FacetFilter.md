[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / FacetFilter

# Interface: FacetFilter

Defined in: [models.ts:14](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/search/src/models.ts#L14)

A filter to apply to a facet field, narrowing search results to items matching the given value(s).

## Properties

### operator

> **operator**: [`FacetFilterOperator`](../type-aliases/FacetFilterOperator.md)

Defined in: [models.ts:19](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/search/src/models.ts#L19)

Comparison operator. Use 'eq' for strings, tags, and booleans.
Numeric and datetime fields additionally support 'gt', 'lt', 'ge', 'le'.

***

### value

> **value**: `string` \| `number` \| `boolean` \| (`string` \| `number` \| `boolean`)[]

Defined in: [models.ts:24](https://github.com/Sitecore/content-sdk/blob/e2bac910e40a6a22e8fa9fcb73f79f143a5fcf46/packages/search/src/models.ts#L24)

The value to filter by. Pass an array to match any of the given values (OR semantics).
Array values are only supported with the 'eq' operator.
