[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / ProxyHandler

# Abstract Class: ProxyHandler

Defined in: [nextjs/src/proxy/proxy.ts:45](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L45)

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

Defined in: [nextjs/src/proxy/proxy.ts:51](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/nextjs/src/proxy/proxy.ts#L51)

Handler method to execute proxy logic

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `NextRequest` | request |
| `res` | `NextResponse` | response |

#### Returns

`Promise`\<`NextResponse`\<`unknown`\>\>
