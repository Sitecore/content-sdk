[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / FacetResult

# Interface: FacetResult

Defined in: [models.ts:79](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/search/src/models.ts#L79)

A facet result containing the facet's display name and its available values.

## Properties

### name

> **name**: `string`

Defined in: [models.ts:83](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/search/src/models.ts#L83)

The display name of the facet.

***

### value

> **value**: [`FacetValue`](FacetValue.md)[]

Defined in: [models.ts:87](https://github.com/Sitecore/content-sdk/blob/c7801c33fe661bb4b9b6f414c72a29794de8b26a/packages/search/src/models.ts#L87)

The list of values found for this facet, each with a result count.
