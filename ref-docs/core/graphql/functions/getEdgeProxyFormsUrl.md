[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [graphql](../README.md) / getEdgeProxyFormsUrl

# Function: getEdgeProxyFormsUrl()

> **getEdgeProxyFormsUrl**(`sitecoreEdgeContextId`, `formId`, `sitecoreEdgeUrl`?): `string`

Defined in: [packages/core/src/graphql/graphql-edge-proxy.ts:21](https://github.com/Sitecore/xmc-jss-dev/blob/b61df9eebcfba1bdf753510a061ce22b4c35f004/packages/core/src/graphql/graphql-edge-proxy.ts#L21)

Generates a URL for accessing Sitecore Edge Platform Forms using the provided form ID and context ID.

## Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `sitecoreEdgeContextId` | `string` | `undefined` | The unique context id. |
| `formId` | `string` | `undefined` | The unique form id. |
| `sitecoreEdgeUrl`? | `string` | `SITECORE_EDGE_URL_DEFAULT` | The base endpoint URL for the Edge Platform. Default is https://edge-platform.sitecorecloud.io |

## Returns

`string`

The complete URL for accessing forms through the Edge Platform.
