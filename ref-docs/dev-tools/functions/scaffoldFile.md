[**@sitecore-content-sdk/dev-tools**](../README.md)

***

[@sitecore-content-sdk/dev-tools](../README.md) / scaffoldFile

# Function: scaffoldFile()

> **scaffoldFile**(`filePath`, `fileContent`): `string` \| `null`

Defined in: [dev-tools/src/templating/scaffold.ts:22](https://github.com/Sitecore/xmc-jss-dev/blob/3c401a01ef03d9637337d095614dea1096bc9b70/packages/dev-tools/src/templating/scaffold.ts#L22)

Creates a file relative to the specified path if the file doesn't exist.
Creates directories as needed.
Does not overwrite existing files.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `filePath` | `string` | the file path |
| `fileContent` | `string` | the file content |

## Returns

`string` \| `null`

the file path if the file was created, otherwise null
