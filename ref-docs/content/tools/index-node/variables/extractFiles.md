[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / extractFiles

# Variable: extractFiles()

> **extractFiles**: (`args`) => (`__namedParameters`) => `Promise`\<`void`\> = `_extractFiles`

Defined in: [content/src/tools/codegen/extract-files.ts:27](https://github.com/Sitecore/content-sdk/blob/88593e741a650b6b128479a0f5ae31aa36f73ec5/packages/content/src/tools/codegen/extract-files.ts#L27)

Extracts components from the app folder and sends them to XMCloud.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `ExtractFilesConfig` | Config for components extraction |

## Returns

> (`__namedParameters`): `Promise`\<`void`\>

### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `scConfig`: [`SitecoreConfig`](../../../config/type-aliases/SitecoreConfig.md); \} |
| `__namedParameters.scConfig` | [`SitecoreConfig`](../../../config/type-aliases/SitecoreConfig.md) |

### Returns

`Promise`\<`void`\>
