[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / ProxyHandler

# Abstract Class: ProxyHandler

Defined in: [nextjs/src/proxy/proxy.ts:45](https://github.com/Sitecore/content-sdk/blob/500ff39a667bc697e65ad8db118ac8c76a24bf2b/packages/nextjs/src/proxy/proxy.ts#L45)

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

Defined in: [nextjs/src/proxy/proxy.ts:51](https://github.com/Sitecore/content-sdk/blob/500ff39a667bc697e65ad8db118ac8c76a24bf2b/packages/nextjs/src/proxy/proxy.ts#L51)

Handler method to execute proxy logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>
