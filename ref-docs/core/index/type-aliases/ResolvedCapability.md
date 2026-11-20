[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / ResolvedCapability

# Type Alias: ResolvedCapability

> **ResolvedCapability** = `boolean` \| \{\[`key`: `string`\]: [`CapabilityMetadata`](CapabilityMetadata.md) \| `ResolvedCapability` \| `undefined`; `metadata?`: [`CapabilityMetadata`](CapabilityMetadata.md); \}

Defined in: [packages/core/src/capabilities.ts:108](https://github.com/Sitecore/content-sdk/blob/51a9829bf867488124b20691dcc78e44f942c3db/packages/core/src/capabilities.ts#L108)

A resolved capability written to application metadata.
Sub-capabilities are nested directly alongside the reserved `metadata` property.
