[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / generateMetadata

# Variable: generateMetadata

> `const` **generateMetadata**: (`config?`) => (`args?`) => `Promise`\<`void`\>

Defined in: core/types/tools/metadata/generateMetadata.d.ts:35

Generate application metadata

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config?` | `GenerateMetadataConfig` | Optional configuration for generating metadata. If not provided, the default '.sitecore/metadata.json' will be used and allowWorkspaces will be set to false. |

## Returns

A promise that resolves when the metadata generation is complete.

(`args?`) => `Promise`\<`void`\>
