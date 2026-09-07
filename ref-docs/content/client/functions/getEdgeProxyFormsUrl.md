[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / getEdgeProxyFormsUrl

# Function: getEdgeProxyFormsUrl()

> **getEdgeProxyFormsUrl**(`sitecoreEdgeContextId`, `formId`, `sitecoreEdgeUrl?`, `language?`): `string`

Defined in: [content/src/client/edge-proxy.ts:32](https://github.com/Sitecore/content-sdk/blob/0c4a8c787ed4dbcd40afe865a25275812940c555/packages/content/src/client/edge-proxy.ts#L32)

**`Internal`**

Generates a URL for accessing Sitecore Edge Platform Forms using the provided form ID and context ID.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sitecoreEdgeContextId` | `string` | `undefined` | The unique context id. |
| `formId` | `string` | `undefined` | The unique form id. |
| `sitecoreEdgeUrl?` | `string` | `constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT` | The base endpoint URL for the Edge Platform (resolved at config level). Defaults to platform URL. |
| `language?` | `string` | `undefined` | Page language used to load the matching multilingual form version. |

## Returns

`string`

The complete URL for accessing forms through the Edge Platform.
