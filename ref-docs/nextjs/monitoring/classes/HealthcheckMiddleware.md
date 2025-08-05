[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [monitoring](../README.md) / HealthcheckMiddleware

# Class: HealthcheckMiddleware

Defined in: [nextjs/src/monitoring/healthcheck-middleware.ts:6](https://github.com/Sitecore/content-sdk/blob/0104fee07cb6a0d1ee5c47a0cf6e259308ac7b0f/packages/nextjs/src/monitoring/healthcheck-middleware.ts#L6)

Middleware / handler for use in healthcheck Next.js API route (e.g. '/api/healthz').

## Constructors

### Constructor

> **new HealthcheckMiddleware**(): `HealthcheckMiddleware`

#### Returns

`HealthcheckMiddleware`

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/monitoring/healthcheck-middleware.ts:11](https://github.com/Sitecore/content-sdk/blob/0104fee07cb6a0d1ee5c47a0cf6e259308ac7b0f/packages/nextjs/src/monitoring/healthcheck-middleware.ts#L11)

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
