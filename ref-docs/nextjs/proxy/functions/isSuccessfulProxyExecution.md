[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / isSuccessfulProxyExecution

# Function: isSuccessfulProxyExecution()

> **isSuccessfulProxyExecution**\<`SuccessfulProxyType`, `T`\>(`info`): `info is T & SuccessfulProxyType`

Defined in: [nextjs/src/proxy/utils.ts:11](https://github.com/Sitecore/content-sdk/blob/c0ef1a2348b52d74656a2f0f9adac3e6eb0e62e4/packages/nextjs/src/proxy/utils.ts#L11)

Type guard to check if the proxy execution was successful

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `SuccessfulProxyType` | `unknown` | The type of the successful proxy execution information |
| `T` *extends* [`ProxiesContextMapValue`](../type-aliases/ProxiesContextMapValue.md) \| `undefined` | [`ProxiesContextMapValue`](../type-aliases/ProxiesContextMapValue.md) \| `undefined` | The type of the proxy execution information, which can be either successful or failed execution information |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `info` | `T` | Information about executed proxy to be stored in the context |

## Returns

`info is T & SuccessfulProxyType`

Type guard to check if the proxy execution was successful
