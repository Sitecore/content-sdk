[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / ResolvedCapability

# Type Alias: ResolvedCapability

> **ResolvedCapability** = `boolean` \| \{\[`key`: `string`\]: [`CapabilityMetadata`](CapabilityMetadata.md) \| `ResolvedCapability` \| `undefined`; `metadata?`: [`CapabilityMetadata`](CapabilityMetadata.md); \}

Defined in: [packages/core/src/capabilities.ts:108](https://github.com/Sitecore/content-sdk/blob/47aea23db5c87b62b269d8f5d3e2ee45d9901657/packages/core/src/capabilities.ts#L108)

A resolved capability written to application metadata.
Sub-capabilities are nested directly alongside the reserved `metadata` property.
