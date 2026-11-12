[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CapabilityDefinition

# Type Alias: CapabilityDefinition

> **CapabilityDefinition** = `object`

Defined in: [packages/core/src/capabilities.ts:58](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/capabilities.ts#L58)

A capability offered by a package.

## Properties

### filter?

> `optional` **filter?**: [`CapabilityFilter`](CapabilityFilter.md)

Defined in: [packages/core/src/capabilities.ts:62](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/capabilities.ts#L62)

Optional build-time check that the application uses the capability.

***

### metadata?

> `optional` **metadata?**: [`CapabilityMetadata`](CapabilityMetadata.md) \| [`CapabilityMetadataResolver`](CapabilityMetadataResolver.md)

Defined in: [packages/core/src/capabilities.ts:64](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/capabilities.ts#L64)

Optional metadata about the capability.

***

### value

> **value**: `boolean` \| [`CapabilityMap`](CapabilityMap.md)\<`CapabilityDefinition`\>

Defined in: [packages/core/src/capabilities.ts:60](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/capabilities.ts#L60)

Whether the capability is offered.
