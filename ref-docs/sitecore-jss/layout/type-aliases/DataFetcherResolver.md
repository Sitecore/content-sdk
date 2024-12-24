[**@sitecore-jss/sitecore-jss**](../../README.md) • **Docs**

***

[@sitecore-jss/sitecore-jss](../../README.md) / [layout](../README.md) / DataFetcherResolver

# Type Alias: DataFetcherResolver()

> **DataFetcherResolver**: \<`T`\>(`req`?, `res`?) => [`HttpDataFetcher`](../../index/type-aliases/HttpDataFetcher.md)\<`T`\>

Data fetcher resolver in order to provide custom data fetcher

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req`? | `IncomingMessage` | Request instance |
| `res`? | `ServerResponse` | Response instance |

## Returns

[`HttpDataFetcher`](../../index/type-aliases/HttpDataFetcher.md)\<`T`\>

## Defined in

[packages/sitecore-jss/src/layout/rest-layout-service.ts:53](https://github.com/Sitecore/xmc-jss-dev/blob/6bb35d1fb67e125ec198f967a41cfdefc0c0a459/packages/sitecore-jss/src/layout/rest-layout-service.ts#L53)
