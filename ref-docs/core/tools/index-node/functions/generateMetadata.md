[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / generateMetadata

# Function: generateMetadata()

> **generateMetadata**(`config?`): () => `Promise`\<`void`\>

Defined in: [packages/core/src/tools/metadata/generateMetadata.ts:35](https://github.com/Sitecore/content-sdk/blob/1f90cbe6031b31512cfc4f80ee1b4f04284b0ee3/packages/core/src/tools/metadata/generateMetadata.ts#L35)

Generate application metadata

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | `GenerateMetadataConfig` | Optional configuration for generating metadata. If not provided, the default '.sitecore/metadata.json' will be used and allowWorkspaces will be set to false. |

## Returns

A promise that resolves when the metadata generation is complete.

() => `Promise`\<`void`\>
