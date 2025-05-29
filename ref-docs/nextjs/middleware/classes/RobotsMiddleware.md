[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / RobotsMiddleware

# Class: RobotsMiddleware

Defined in: [nextjs/src/middleware/robots-middleware.ts:7](https://github.com/Sitecore/content-sdk/blob/bb6cb0807445ce6665598cd43c4dc973fbd7c0ab/packages/nextjs/src/middleware/robots-middleware.ts#L7)

Middleware for handling robots.txt requests in a Next.js application.

## Constructors

### Constructor

> **new RobotsMiddleware**(`client`): `RobotsMiddleware`

Defined in: [nextjs/src/middleware/robots-middleware.ts:10](https://github.com/Sitecore/content-sdk/blob/bb6cb0807445ce6665598cd43c4dc973fbd7c0ab/packages/nextjs/src/middleware/robots-middleware.ts#L10)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `SitecoreClient` |

#### Returns

`RobotsMiddleware`

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/middleware/robots-middleware.ts:14](https://github.com/Sitecore/content-sdk/blob/bb6cb0807445ce6665598cd43c4dc973fbd7c0ab/packages/nextjs/src/middleware/robots-middleware.ts#L14)

#### Returns

> (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>
