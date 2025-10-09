[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / generateMetadata

# Function: generateMetadata()

> **generateMetadata**(`config?`): () => `Promise`\<`void`\>

Defined in: [packages/core/src/tools/generateMetadata.ts:35](https://github.com/Sitecore/content-sdk/blob/1c8f633c7651baec96c06fbaa0804ea244809879/packages/core/src/tools/generateMetadata.ts#L35)

Generate application metadata

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | `GenerateMetadataConfig` | Optional configuration for generating metadata. If not provided, the default '.sitecore/metadata.json' will be used and allowWorkspaces will be set to false. |

## Returns

A promise that resolves when the metadata generation is complete.

> (): `Promise`\<`void`\>

### Returns

`Promise`\<`void`\>
