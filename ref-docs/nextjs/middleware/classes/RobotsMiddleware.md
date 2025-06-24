[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / RobotsMiddleware

# Class: RobotsMiddleware

Defined in: [nextjs/src/middleware/robots-middleware.ts:7](https://github.com/Sitecore/content-sdk/blob/e7d75d2aa9e54bcd8019fdd04e3cd43bd7e016e3/packages/nextjs/src/middleware/robots-middleware.ts#L7)

Middleware for handling robots.txt requests in a Next.js application.

## Constructors

### Constructor

> **new RobotsMiddleware**(`client`): `RobotsMiddleware`

Defined in: [nextjs/src/middleware/robots-middleware.ts:10](https://github.com/Sitecore/content-sdk/blob/e7d75d2aa9e54bcd8019fdd04e3cd43bd7e016e3/packages/nextjs/src/middleware/robots-middleware.ts#L10)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `client` | `SitecoreClient` |

#### Returns

`RobotsMiddleware`

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/middleware/robots-middleware.ts:14](https://github.com/Sitecore/content-sdk/blob/e7d75d2aa9e54bcd8019fdd04e3cd43bd7e016e3/packages/nextjs/src/middleware/robots-middleware.ts#L14)

#### Returns

> (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>
