[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [layout](../README.md) / getDesignLibraryStylesheetLinks

# Function: getDesignLibraryStylesheetLinks()

> **getDesignLibraryStylesheetLinks**(`layoutData`, `sitecoreEdgeContextId`, `sitecoreEdgeUrl?`): [`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

Defined in: [content/src/layout/themes.ts:20](https://github.com/Sitecore/content-sdk/blob/c3e1d0a82b1cf70c131a171395bad245d2f46f59/packages/content/src/layout/themes.ts#L20)

Walks through rendering tree and returns list of links of all FEAAS, BYOC or SXA Design Library Stylesheets that are used

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) | `undefined` | Layout service data |
| `sitecoreEdgeContextId` | `string` | `undefined` | Sitecore Edge Context ID |
| `sitecoreEdgeUrl?` | `string` | `constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT` | Sitecore Edge Platform URL (resolved at config level). Defaults to platform URL. |

## Returns

[`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

library stylesheet links
