[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / generateMetadata

# Function: generateMetadata()

> **generateMetadata**(`config`?): () => `Promise`\<`void`\>

Defined in: [packages/core/src/tools/generateMetadata.ts:30](https://github.com/Sitecore/content-sdk/blob/750ea744c6ba45e5480c921acf549ec48c53b303/packages/core/src/tools/generateMetadata.ts#L30)

Generate application metadata

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | `GenerateMetadataConfig` | Optional configuration for generating metadata. If not provided, the default '.sitecore/metadata.json' will be used. |

## Returns

`Function`

A promise that resolves when the metadata generation is complete.

### Returns

`Promise`\<`void`\>
