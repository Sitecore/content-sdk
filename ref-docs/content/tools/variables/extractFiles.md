[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / extractFiles

# Variable: extractFiles()

> **extractFiles**: (`args`) => (`__namedParameters`) => `Promise`\<`void`\> = `_extractFiles`

Defined in: [content/src/tools/codegen/extract-files.ts:27](https://github.com/Sitecore/content-sdk/blob/500ff39a667bc697e65ad8db118ac8c76a24bf2b/packages/content/src/tools/codegen/extract-files.ts#L27)

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
| `__namedParameters` | \{ `scConfig`: [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md); \} |
| `__namedParameters.scConfig` | [`SitecoreConfig`](../../config/type-aliases/SitecoreConfig.md) |

### Returns

`Promise`\<`void`\>
