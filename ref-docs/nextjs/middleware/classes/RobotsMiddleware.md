[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / RobotsMiddleware

# Class: RobotsMiddleware

Defined in: [nextjs/src/middleware/robots-middleware.ts:12](https://github.com/Sitecore/content-sdk/blob/84bf2bda90cece7039a2dce1d068cc3670fab0df/packages/nextjs/src/middleware/robots-middleware.ts#L12)

Middleware for handling robots.txt requests in a Next.js application.

## Constructors

### Constructor

> **new RobotsMiddleware**(`client`, `sites`): `RobotsMiddleware`

Defined in: [nextjs/src/middleware/robots-middleware.ts:16](https://github.com/Sitecore/content-sdk/blob/84bf2bda90cece7039a2dce1d068cc3670fab0df/packages/nextjs/src/middleware/robots-middleware.ts#L16)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `SitecoreClient` |
| `sites` | [`SiteInfo`](../../index/type-aliases/SiteInfo.md)[] |

#### Returns

`RobotsMiddleware`

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/middleware/robots-middleware.ts:21](https://github.com/Sitecore/content-sdk/blob/84bf2bda90cece7039a2dce1d068cc3670fab0df/packages/nextjs/src/middleware/robots-middleware.ts#L21)

#### Returns

(`req`, `res`) => `Promise`\<`void`\>
