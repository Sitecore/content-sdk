[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / RobotsMiddleware

# Class: RobotsMiddleware

Defined in: [nextjs/src/middleware/robots-middleware.ts:7](https://github.com/Sitecore/content-sdk/blob/5340b58d21e724c672e5a0ec619aff194e9a7a60/packages/nextjs/src/middleware/robots-middleware.ts#L7)

Middleware for handling robots.txt requests in a Next.js application.

## Constructors

### Constructor

> **new RobotsMiddleware**(`client`): `RobotsMiddleware`

Defined in: [nextjs/src/middleware/robots-middleware.ts:10](https://github.com/Sitecore/content-sdk/blob/5340b58d21e724c672e5a0ec619aff194e9a7a60/packages/nextjs/src/middleware/robots-middleware.ts#L10)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `SitecoreClient` |

#### Returns

`RobotsMiddleware`

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/middleware/robots-middleware.ts:14](https://github.com/Sitecore/content-sdk/blob/5340b58d21e724c672e5a0ec619aff194e9a7a60/packages/nextjs/src/middleware/robots-middleware.ts#L14)

#### Returns

> (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>
