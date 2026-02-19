[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / getDesignLibraryScriptLink

# Function: getDesignLibraryScriptLink()

> **getDesignLibraryScriptLink**(`sitecoreEdgeUrl?`): `string`

Defined in: [content/src/editing/design-library.ts:239](https://github.com/Sitecore/content-sdk/blob/93fb4095715f238f6ba12b275948e1f3a8215ed2/packages/content/src/editing/design-library.ts#L239)

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
