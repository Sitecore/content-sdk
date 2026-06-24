[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / defineProxy

# Function: defineProxy()

> **defineProxy**(...`proxies`): `object`

Defined in: [nextjs/src/proxy/proxy.ts:260](https://github.com/Sitecore/content-sdk/blob/c6c8dd642e4121eb4a68d30358fc75b7fc6cf641/packages/nextjs/src/proxy/proxy.ts#L260)

Define a proxy with a list of proxy handlers

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| ...`proxies` | [`ProxyHandler`](../classes/ProxyHandler.md)[] | List of proxy handlers to execute |

## Returns

### exec

> **exec**: (`req`, `res?`, `proxiesContext?`) => `Promise`\<`NextResponse`\<`unknown`\>\>

Execute all proxies

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res?` | `NextResponse`\<`unknown`\> | response |
| `proxiesContext?` | [`ProxiesContext`](../type-aliases/ProxiesContext.md) | context to share information between proxies |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>
