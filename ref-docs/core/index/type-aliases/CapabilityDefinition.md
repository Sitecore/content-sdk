[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CapabilityDefinition

# Type Alias: CapabilityDefinition

> **CapabilityDefinition** = `object`

Defined in: [packages/core/src/capabilities.ts:58](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/capabilities.ts#L58)

A capability offered by a package.

## Properties

### filter?

> `optional` **filter?**: [`CapabilityFilter`](CapabilityFilter.md)

Defined in: [packages/core/src/capabilities.ts:62](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/capabilities.ts#L62)

Optional build-time check that the application uses the capability.

***

### metadata?

> `optional` **metadata?**: [`CapabilityMetadata`](CapabilityMetadata.md) \| [`CapabilityMetadataResolver`](CapabilityMetadataResolver.md)

Defined in: [packages/core/src/capabilities.ts:64](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/capabilities.ts#L64)

Optional metadata about the capability.

***

### value

> **value**: `boolean` \| [`CapabilityMap`](CapabilityMap.md)\<`CapabilityDefinition`\>

Defined in: [packages/core/src/capabilities.ts:60](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/core/src/capabilities.ts#L60)

Whether the capability is offered.
