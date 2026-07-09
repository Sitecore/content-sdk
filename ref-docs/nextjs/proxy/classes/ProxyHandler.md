[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / ProxyHandler

# Abstract Class: ProxyHandler

Defined in: [nextjs/src/proxy/proxy.ts:52](https://github.com/Sitecore/content-sdk/blob/407173b8dd1ade15e570175d8b08fef690e7cef9/packages/nextjs/src/proxy/proxy.ts#L52)

Proxy handler class to be extended by all proxy implementations

## Extended by

- [`ProxyBase`](ProxyBase.md)

## Constructors

### Constructor

> **new ProxyHandler**(): `ProxyHandler`

#### Returns

`ProxyHandler`

## Accessors

### name

#### Get Signature

> **get** `abstract` **name**(): `string`

Defined in: [nextjs/src/proxy/proxy.ts:56](https://github.com/Sitecore/content-sdk/blob/407173b8dd1ade15e570175d8b08fef690e7cef9/packages/nextjs/src/proxy/proxy.ts#L56)

Name of the proxy, used as a key in the context to store information about executed proxies

##### Returns

`string`

## Methods

### handle()

> `abstract` **handle**(`req`, `res`, `proxiesContext?`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/proxy/proxy.ts:64](https://github.com/Sitecore/content-sdk/blob/407173b8dd1ade15e570175d8b08fef690e7cef9/packages/nextjs/src/proxy/proxy.ts#L64)

Handler method to execute proxy logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |
| `proxiesContext?` | [`ProxiesContext`](../type-aliases/ProxiesContext.md) | context to share information between proxies |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>
