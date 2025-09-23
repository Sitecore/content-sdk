[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / getDesignLibraryStylesheetLinks

# Function: getDesignLibraryStylesheetLinks()

> **getDesignLibraryStylesheetLinks**(`layoutData`, `sitecoreEdgeContextId`, `sitecoreEdgeUrl?`): [`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

Defined in: [packages/core/src/layout/themes.ts:19](https://github.com/Sitecore/content-sdk/blob/3a3301c5fd596749a0c51a4826e9163b9f1b97ea/packages/core/src/layout/themes.ts#L19)

Walks through rendering tree and returns list of links of all FEAAS, BYOC or SXA Design Library Stylesheets that are used

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `layoutData` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) | `undefined` | Layout service data |
| `sitecoreEdgeContextId` | `string` | `undefined` | Sitecore Edge Context ID |
| `sitecoreEdgeUrl?` | `string` | `SITECORE_EDGE_URL_DEFAULT` | Sitecore Edge Platform URL. Default is https://edge-platform.sitecorecloud.io |

## Returns

[`HTMLLink`](../../index/type-aliases/HTMLLink.md)[]

library stylesheet links
