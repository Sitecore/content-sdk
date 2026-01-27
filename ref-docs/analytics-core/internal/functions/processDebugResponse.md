[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / processDebugResponse

# Function: processDebugResponse()

> **processDebugResponse**(`namespace`, `response`): `object`

Defined in: [src/debug/debug.ts:13](https://github.com/Sitecore/content-sdk/blob/4c91e9096c4e7c0afcb0aa1545c8537310c5d3aa/packages/analytics-core/src/debug/debug.ts#L13)

Extracts debug information from an HTTP response if debugging is enabled.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespace` | `string` | The debug namespace used to check if debugging is enabled. |
| `response` | `Response` | The HTTP response object from fetch. |

## Returns

`object`

An object containing selected response details for debugging purposes.
