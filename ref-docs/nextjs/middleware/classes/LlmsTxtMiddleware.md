[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / LlmsTxtMiddleware

# Class: LlmsTxtMiddleware

Defined in: [nextjs/src/middleware/llms-txt-middleware.ts:12](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/nextjs/src/middleware/llms-txt-middleware.ts#L12)

Middleware for handling llms.txt requests in a Next.js application.

## Constructors

### Constructor

> **new LlmsTxtMiddleware**(`client`, `sites`): `LlmsTxtMiddleware`

Defined in: [nextjs/src/middleware/llms-txt-middleware.ts:16](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/nextjs/src/middleware/llms-txt-middleware.ts#L16)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `SitecoreClient` |
| `sites` | [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[] |

#### Returns

`LlmsTxtMiddleware`

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/middleware/llms-txt-middleware.ts:21](https://github.com/Sitecore/content-sdk/blob/b0823f3a364598af8034e451448160c20b885d18/packages/nextjs/src/middleware/llms-txt-middleware.ts#L21)

#### Returns

(`req`, `res`) => `Promise`\<`void`\>
