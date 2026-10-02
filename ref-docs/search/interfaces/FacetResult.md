[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / FacetResult

# Interface: FacetResult

Defined in: [models.ts:79](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/search/src/models.ts#L79)

A facet result containing the facet's display name and its available values.

## Properties

### name

> **name**: `string`

Defined in: [models.ts:83](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/search/src/models.ts#L83)

The display name of the facet.

***

### value

> **value**: [`FacetValue`](FacetValue.md)[]

Defined in: [models.ts:87](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/search/src/models.ts#L87)

The list of values found for this facet, each with a result count.
