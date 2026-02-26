[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / processDebugResponse

# Function: processDebugResponse()

> **processDebugResponse**(`namespace`, `response`): `object`

Defined in: [src/debug/debug.ts:13](https://github.com/Sitecore/content-sdk/blob/0ba09b9a5fb85cb3112ce168d8e0ff92da4b4633/packages/analytics-core/src/debug/debug.ts#L13)

Extracts debug information from an HTTP response if debugging is enabled.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespace` | `string` | The debug namespace used to check if debugging is enabled. |
| `response` | `Response` | The HTTP response object from fetch. |

## Returns

`object`

An object containing selected response details for debugging purposes.
