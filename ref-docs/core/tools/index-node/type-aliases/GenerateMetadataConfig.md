[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / GenerateMetadataConfig

# Type Alias: GenerateMetadataConfig

> **GenerateMetadataConfig** = `object`

Defined in: [packages/core/src/tools/metadata/generateMetadata.ts:17](https://github.com/Sitecore/content-sdk/blob/d7a3c5aad0610817ec39a8d7adbdbdc09d785aad/packages/core/src/tools/metadata/generateMetadata.ts#L17)

Configuration options for generating metadata.

## Properties

### ~~allowWorkspaces?~~

> `optional` **allowWorkspaces?**: `boolean`

Defined in: [packages/core/src/tools/metadata/generateMetadata.ts:28](https://github.com/Sitecore/content-sdk/blob/d7a3c5aad0610817ec39a8d7adbdbdc09d785aad/packages/core/src/tools/metadata/generateMetadata.ts#L28)

Optional flag to allow npm workspaces in the metadata generation. Should be kept as false for non-npm monorepos.
If not provided, the default is false.

#### Deprecated

Package-manager-based package discovery will be removed in a future version.

***

### appInputs?

> `optional` **appInputs?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/core/src/tools/metadata/generateMetadata.ts:37](https://github.com/Sitecore/content-sdk/blob/d7a3c5aad0610817ec39a8d7adbdbdc09d785aad/packages/core/src/tools/metadata/generateMetadata.ts#L37)

Custom application inputs passed to capability filters and metadata resolvers,
e.g. the atoms catalog: `{ atomsCatalog: catalog }`.

***

### capabilities?

> `optional` **capabilities?**: `boolean`

Defined in: [packages/core/src/tools/metadata/generateMetadata.ts:32](https://github.com/Sitecore/content-sdk/blob/d7a3c5aad0610817ec39a8d7adbdbdc09d785aad/packages/core/src/tools/metadata/generateMetadata.ts#L32)

Whether to calculate installed package capabilities. Defaults to true.

***

### destinationPath?

> `optional` **destinationPath?**: `string`

Defined in: [packages/core/src/tools/metadata/generateMetadata.ts:22](https://github.com/Sitecore/content-sdk/blob/d7a3c5aad0610817ec39a8d7adbdbdc09d785aad/packages/core/src/tools/metadata/generateMetadata.ts#L22)

Optional path where the generated metadata will be saved.
If not provided, the default '.sitecore/metadata.json' will be used.
