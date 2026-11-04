[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / ResolvedCapability

# Type Alias: ResolvedCapability

> **ResolvedCapability** = `true` \| \{\[`key`: `string`\]: [`CapabilityMetadata`](CapabilityMetadata.md) \| `ResolvedCapability` \| `undefined`; `metadata?`: [`CapabilityMetadata`](CapabilityMetadata.md); \}

Defined in: [packages/core/src/capabilities.ts:98](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/capabilities.ts#L98)

A resolved capability written to application metadata.
Sub-capabilities are nested directly alongside the reserved `metadata` property.
