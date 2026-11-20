[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CapabilityDefinition

# Type Alias: CapabilityDefinition

> **CapabilityDefinition** = `object`

Defined in: [packages/core/src/capabilities.ts:58](https://github.com/Sitecore/content-sdk/blob/51a9829bf867488124b20691dcc78e44f942c3db/packages/core/src/capabilities.ts#L58)

A capability offered by a package.

## Properties

### filter?

> `optional` **filter?**: [`CapabilityFilter`](CapabilityFilter.md)

Defined in: [packages/core/src/capabilities.ts:62](https://github.com/Sitecore/content-sdk/blob/51a9829bf867488124b20691dcc78e44f942c3db/packages/core/src/capabilities.ts#L62)

Optional build-time check that the application uses the capability.

***

### metadata?

> `optional` **metadata?**: [`CapabilityMetadata`](CapabilityMetadata.md) \| [`CapabilityMetadataResolver`](CapabilityMetadataResolver.md)

Defined in: [packages/core/src/capabilities.ts:64](https://github.com/Sitecore/content-sdk/blob/51a9829bf867488124b20691dcc78e44f942c3db/packages/core/src/capabilities.ts#L64)

Optional metadata about the capability.

***

### value

> **value**: `boolean` \| [`CapabilityMap`](CapabilityMap.md)\<`CapabilityDefinition`\>

Defined in: [packages/core/src/capabilities.ts:60](https://github.com/Sitecore/content-sdk/blob/51a9829bf867488124b20691dcc78e44f942c3db/packages/core/src/capabilities.ts#L60)

Whether the capability is offered.
