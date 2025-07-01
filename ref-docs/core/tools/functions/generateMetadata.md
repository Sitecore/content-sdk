[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / generateMetadata

# Function: generateMetadata()

> **generateMetadata**(`config?`): () => `Promise`\<`void`\>

Defined in: [packages/core/src/tools/generateMetadata.ts:30](https://github.com/Sitecore/content-sdk/blob/af8b412b06b078731c4e0c34b094b68cd0919267/packages/core/src/tools/generateMetadata.ts#L30)

Generate application metadata

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | `GenerateMetadataConfig` | Optional configuration for generating metadata. If not provided, the default '.sitecore/metadata.json' will be used. |

## Returns

A promise that resolves when the metadata generation is complete.

> (): `Promise`\<`void`\>

### Returns

`Promise`\<`void`\>
