[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / getDesignLibraryScriptLink

# Function: getDesignLibraryScriptLink()

> **getDesignLibraryScriptLink**(`sitecoreEdgeUrl?`): `string`

Defined in: [content/src/editing/design-library.ts:247](https://github.com/Sitecore/content-sdk/blob/2dc64e62333bc02156fe37ffdcae6ab8a71ff4cc/packages/content/src/editing/design-library.ts#L247)

**`Internal`**

Generates the URL for the design library script link.
Caller should pass the resolved Edge URL from config.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sitecoreEdgeUrl?` | `string` | `constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT` | Sitecore Edge Platform URL (resolved at config level). Defaults to platform URL. |

## Returns

`string`

The full URL to the design library script.
