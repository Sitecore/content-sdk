[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / RobotsMiddleware

# Class: RobotsMiddleware

Defined in: [nextjs/src/middleware/robots-middleware.ts:9](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/nextjs/src/middleware/robots-middleware.ts#L9)

Middleware for handling robots.txt requests in a Next.js application.

## Constructors

### Constructor

> **new RobotsMiddleware**(`client`, `sites`): `RobotsMiddleware`

Defined in: [nextjs/src/middleware/robots-middleware.ts:13](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/nextjs/src/middleware/robots-middleware.ts#L13)

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

Defined in: [nextjs/src/middleware/robots-middleware.ts:18](https://github.com/Sitecore/content-sdk/blob/9b2bdd65f66ee69853daa1ed4741d23c859b9661/packages/nextjs/src/middleware/robots-middleware.ts#L18)

#### Returns

> (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>
