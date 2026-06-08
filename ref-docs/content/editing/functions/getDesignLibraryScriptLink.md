[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / getDesignLibraryScriptLink

# Function: getDesignLibraryScriptLink()

> **getDesignLibraryScriptLink**(`sitecoreEdgeUrl?`): `string`

Defined in: [content/src/editing/design-library.ts:247](https://github.com/Sitecore/content-sdk/blob/585d583b22461a5fc38589fdf351e01bd3e65204/packages/content/src/editing/design-library.ts#L247)

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
