[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [monitoring](../README.md) / HealthcheckMiddleware

# Class: HealthcheckMiddleware

Defined in: [nextjs/src/monitoring/healthcheck-middleware.ts:7](https://github.com/Sitecore/content-sdk/blob/d905c41e68457d1a6a8bb86464339100ff85d126/packages/nextjs/src/monitoring/healthcheck-middleware.ts#L7)

Middleware / handler for use in healthcheck Next.js API route (e.g. '/api/healthz').

## Constructors

### Constructor

> **new HealthcheckMiddleware**(): `HealthcheckMiddleware`

#### Returns

`HealthcheckMiddleware`

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/monitoring/healthcheck-middleware.ts:12](https://github.com/Sitecore/content-sdk/blob/d905c41e68457d1a6a8bb86464339100ff85d126/packages/nextjs/src/monitoring/healthcheck-middleware.ts#L12)

Gets the Next.js API route handler

#### Returns

route handler

> (`req`, `res`): `Promise`\<`void`\>

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextApiRequest` |
| `res` | `NextApiResponse` |

##### Returns

`Promise`\<`void`\>
