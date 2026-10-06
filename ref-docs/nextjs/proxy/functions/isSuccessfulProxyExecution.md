[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / isSuccessfulProxyExecution

# Function: isSuccessfulProxyExecution()

> **isSuccessfulProxyExecution**\<`SuccessfulProxyType`, `T`\>(`info`): `info is T & SuccessfulProxyType`

Defined in: [nextjs/src/proxy/utils.ts:11](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/nextjs/src/proxy/utils.ts#L11)

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
