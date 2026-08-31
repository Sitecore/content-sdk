[**@sitecore-content-sdk/content**](../../../README.md)

***

[@sitecore-content-sdk/content](../../../README.md) / [tools/index-node](../README.md) / ExtractFilesConfig

# Type Alias: ExtractFilesConfig

> **ExtractFilesConfig** = `object`

Defined in: [content/src/tools/codegen/extract-files.ts:23](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/content/src/tools/codegen/extract-files.ts#L23)

Configuration for the [extractFiles](../variables/extractFiles.md) build command.

## Properties

### clientComponentMapPath?

> `optional` **clientComponentMapPath?**: `string`

Defined in: [content/src/tools/codegen/extract-files.ts:25](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/content/src/tools/codegen/extract-files.ts#L25)

***

### componentMapPath?

> `optional` **componentMapPath?**: `string`

Defined in: [content/src/tools/codegen/extract-files.ts:24](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/content/src/tools/codegen/extract-files.ts#L24)

***

### customValidateDeployContext?

> `optional` **customValidateDeployContext?**: () => `boolean`

Defined in: [content/src/tools/codegen/extract-files.ts:26](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/content/src/tools/codegen/extract-files.ts#L26)

#### Returns

`boolean`

***

### gatherCompanionFiles?

> `optional` **gatherCompanionFiles?**: (`componentFilePath`, `componentKey`) => [`ExtractedFile`](ExtractedFile.md)[]

Defined in: [content/src/tools/codegen/extract-files.ts:32](https://github.com/Sitecore/content-sdk/blob/914f94abd5c6f509caaa2c6e19c9dbbdf6bca65d/packages/content/src/tools/codegen/extract-files.ts#L32)

Optional hook to gather additional source files a resolved component references
externally (e.g. Angular `templateUrl` / `styleUrls`). Called once per resolved
component file; each returned file is dispatched to the mesh endpoint alongside it.

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `componentFilePath` | `string` |
| `componentKey` | `string` |

#### Returns

[`ExtractedFile`](ExtractedFile.md)[]
