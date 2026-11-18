[**@sitecore-content-sdk/search**](../README.md)

***

[@sitecore-content-sdk/search](../README.md) / FacetResult

# Interface: FacetResult

Defined in: [models.ts:86](https://github.com/Sitecore/content-sdk/blob/17c91dd6a59e449fbba2c70048fe1b4ce6a5fb72/packages/search/src/models.ts#L86)

A facet result containing the facet's display name and its available values.

## Properties

### name

> **name**: `string`

Defined in: [models.ts:90](https://github.com/Sitecore/content-sdk/blob/17c91dd6a59e449fbba2c70048fe1b4ce6a5fb72/packages/search/src/models.ts#L90)

The display name of the facet.

***

### value

> **value**: [`FacetValue`](FacetValue.md)[]

Defined in: [models.ts:94](https://github.com/Sitecore/content-sdk/blob/17c91dd6a59e449fbba2c70048fe1b4ce6a5fb72/packages/search/src/models.ts#L94)

The list of values found for this facet, each with a result count.
