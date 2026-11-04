[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CapabilityDefinition

# Type Alias: CapabilityDefinition

> **CapabilityDefinition** = `object`

Defined in: [packages/core/src/capabilities.ts:48](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/capabilities.ts#L48)

A capability offered by a package.

## Properties

### filter?

> `optional` **filter?**: [`CapabilityFilter`](CapabilityFilter.md)

Defined in: [packages/core/src/capabilities.ts:52](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/capabilities.ts#L52)

Optional build-time check that the application uses the capability.

***

### metadata?

> `optional` **metadata?**: [`CapabilityMetadata`](CapabilityMetadata.md)

Defined in: [packages/core/src/capabilities.ts:54](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/capabilities.ts#L54)

Optional metadata about the capability.

***

### value

> **value**: `boolean` \| [`CapabilityMap`](CapabilityMap.md)\<`CapabilityDefinition`\>

Defined in: [packages/core/src/capabilities.ts:50](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/capabilities.ts#L50)

Whether the capability is offered.
