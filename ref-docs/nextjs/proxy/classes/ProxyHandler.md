[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / ProxyHandler

# Abstract Class: ProxyHandler

Defined in: [nextjs/src/proxy/proxy.ts:44](https://github.com/Sitecore/content-sdk/blob/4c91e9096c4e7c0afcb0aa1545c8537310c5d3aa/packages/nextjs/src/proxy/proxy.ts#L44)

Proxy handler class to be extended by all proxy implementations

## Extended by

- [`ProxyBase`](ProxyBase.md)

## Constructors

### Constructor

> **new ProxyHandler**(): `ProxyHandler`

#### Returns

`ProxyHandler`

## Methods

### handle()

> `abstract` **handle**(`req`, `res`): `Promise`\<`NextResponse`\<`unknown`\>\>

Defined in: [nextjs/src/proxy/proxy.ts:50](https://github.com/Sitecore/content-sdk/blob/4c91e9096c4e7c0afcb0aa1545c8537310c5d3aa/packages/nextjs/src/proxy/proxy.ts#L50)

Handler method to execute proxy logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>
