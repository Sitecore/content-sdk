[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / generateMetadata

# Function: generateMetadata()

> **generateMetadata**(`config?`): (`args?`) => `Promise`\<`void`\>

Defined in: [packages/core/src/tools/metadata/generateMetadata.ts:47](https://github.com/Sitecore/content-sdk/blob/84bf2bda90cece7039a2dce1d068cc3670fab0df/packages/core/src/tools/metadata/generateMetadata.ts#L47)

Generate application metadata

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | [`GenerateMetadataConfig`](../type-aliases/GenerateMetadataConfig.md) | Optional configuration for generating metadata. If not provided, the default '.sitecore/metadata.json' will be used and allowWorkspaces will be set to false. |

## Returns

A promise that resolves when the metadata generation is complete.

(`args?`) => `Promise`\<`void`\>
