[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / generateMetadata

# Function: generateMetadata()

> **generateMetadata**(`config?`): () => `Promise`\<`void`\>

Defined in: [packages/core/src/tools/generateMetadata.ts:30](https://github.com/Sitecore/content-sdk/blob/a10265eeed96cff602ebc20fbfc8e3d581265b9b/packages/core/src/tools/generateMetadata.ts#L30)

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
