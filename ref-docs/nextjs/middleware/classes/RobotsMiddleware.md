[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / RobotsMiddleware

# Class: RobotsMiddleware

Defined in: [nextjs/src/middleware/robots-middleware.ts:8](https://github.com/Sitecore/content-sdk/blob/db0340f489a1a48fba3b33f286fdd6dc507466bf/packages/nextjs/src/middleware/robots-middleware.ts#L8)

Middleware for handling robots.txt requests in a Next.js application.

## Constructors

### Constructor

> **new RobotsMiddleware**(`client`, `sites`): `RobotsMiddleware`

Defined in: [nextjs/src/middleware/robots-middleware.ts:12](https://github.com/Sitecore/content-sdk/blob/db0340f489a1a48fba3b33f286fdd6dc507466bf/packages/nextjs/src/middleware/robots-middleware.ts#L12)

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

Defined in: [nextjs/src/middleware/robots-middleware.ts:17](https://github.com/Sitecore/content-sdk/blob/db0340f489a1a48fba3b33f286fdd6dc507466bf/packages/nextjs/src/middleware/robots-middleware.ts#L17)

#### Returns

> (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>
