[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / defineProxy

# Function: defineProxy()

> **defineProxy**(...`proxies`): `object`

Defined in: [nextjs/src/proxy/proxy.ts:260](https://github.com/Sitecore/content-sdk/blob/0e7dce683a0be4b8942bf4dc050856cd3c28ba07/packages/nextjs/src/proxy/proxy.ts#L260)

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
