[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / GetMetadataConfig

# Type Alias: GetMetadataConfig

> **GetMetadataConfig** = `object`

Defined in: [packages/core/src/tools/metadata/metadata.ts:32](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/tools/metadata/metadata.ts#L32)

Configuration for building application metadata.

## Properties

### ~~allowWorkspaces?~~

> `optional` **allowWorkspaces?**: `boolean`

Defined in: [packages/core/src/tools/metadata/metadata.ts:37](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/tools/metadata/metadata.ts#L37)

Whether packages from all workspaces should be included.

#### Deprecated

Package-manager-based package discovery will be removed in a future version.

***

### appRoot?

> `optional` **appRoot?**: `string`

Defined in: [packages/core/src/tools/metadata/metadata.ts:41](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/tools/metadata/metadata.ts#L41)

Application root used for capability resolution. Defaults to the current working directory.

***

### capabilities?

> `optional` **capabilities?**: `boolean`

Defined in: [packages/core/src/tools/metadata/metadata.ts:39](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/tools/metadata/metadata.ts#L39)

Whether to resolve installed package capabilities. Defaults to true.

***

### sitecoreConfig?

> `optional` **sitecoreConfig?**: [`CapabilitySitecoreConfig`](../../../index/type-aliases/CapabilitySitecoreConfig.md)

Defined in: [packages/core/src/tools/metadata/metadata.ts:43](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/tools/metadata/metadata.ts#L43)

Resolved Sitecore configuration passed to capability filters.
