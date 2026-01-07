[**@sitecore-content-sdk/__core__**](../../README.md)

***

[@sitecore-content-sdk/__core__](../../README.md) / [internal](../README.md) / processDebugResponse

# Function: processDebugResponse()

> **processDebugResponse**(`namespace`, `response`): `object`

Defined in: [src/debug/debug.ts:13](https://github.com/Sitecore/content-sdk/blob/a92cd174849c6a63e55e22ffdf4753663b81fab9/packages/__core__/src/debug/debug.ts#L13)

Extracts debug information from an HTTP response if debugging is enabled.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `namespace` | `string` | The debug namespace used to check if debugging is enabled. |
| `response` | `Response` | The HTTP response object from fetch. |

## Returns

`object`

An object containing selected response details for debugging purposes.
