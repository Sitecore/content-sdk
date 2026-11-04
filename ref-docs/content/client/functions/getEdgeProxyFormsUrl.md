[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [client](../README.md) / getEdgeProxyFormsUrl

# Function: getEdgeProxyFormsUrl()

> **getEdgeProxyFormsUrl**(`formId`, `sitecoreEdgeUrl?`, `language?`): `string`

Defined in: [content/src/client/edge-proxy.ts:32](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/content/src/client/edge-proxy.ts#L32)

**`Internal`**

Generates a URL for accessing Sitecore Edge Platform Forms using the provided form ID.
The context id is sent in the `x-sitecore-contextid` request header by the caller.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `formId` | `string` | `undefined` | The unique form id. |
| `sitecoreEdgeUrl?` | `string` | `constants.SITECORE_EDGE_PLATFORM_URL_DEFAULT` | The base endpoint URL for the Edge Platform (resolved at config level). Defaults to platform URL. |
| `language?` | `string` | `undefined` | Page language used to load the matching multilingual form version. |

## Returns

`string`

The complete URL for accessing forms through the Edge Platform.
