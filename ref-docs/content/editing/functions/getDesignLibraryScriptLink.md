[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / getDesignLibraryScriptLink

# Function: getDesignLibraryScriptLink()

> **getDesignLibraryScriptLink**(`sitecoreEdgeUrl?`): `string`

Defined in: [content/src/editing/design-library.ts:248](https://github.com/Sitecore/content-sdk/blob/8eb01ef1062b410d0a689de49635870a3d3afbde/packages/content/src/editing/design-library.ts#L248)

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
