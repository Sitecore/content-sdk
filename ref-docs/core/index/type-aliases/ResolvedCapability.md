[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / ResolvedCapability

# Type Alias: ResolvedCapability

> **ResolvedCapability** = `boolean` \| \{\[`key`: `string`\]: [`CapabilityMetadata`](CapabilityMetadata.md) \| `ResolvedCapability` \| `undefined`; `metadata?`: [`CapabilityMetadata`](CapabilityMetadata.md); \}

Defined in: [packages/core/src/capabilities.ts:108](https://github.com/Sitecore/content-sdk/blob/84b2ebcb77b1c88a88e7b2b7d4b9b7117148025d/packages/core/src/capabilities.ts#L108)

A resolved capability written to application metadata.
Sub-capabilities are nested directly alongside the reserved `metadata` property.
