[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / defineProxy

# Function: defineProxy()

> **defineProxy**(...`proxies`): `object`

Defined in: [nextjs/src/proxy/proxy.ts:273](https://github.com/Sitecore/content-sdk/blob/2204da329c1296334b71f674795af93d93d50ee9/packages/nextjs/src/proxy/proxy.ts#L273)

Define a proxy with a list of proxy handlers

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`proxies` | [`ProxyHandler`](../classes/ProxyHandler.md)[] | List of proxy handlers to execute |

## Returns

### exec

> **exec**: (`req`, `res?`) => `Promise`\<`NextResponse`\<`unknown`\>\>

Execute all proxies

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res?` | `NextResponse`\<`unknown`\> | response |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>
