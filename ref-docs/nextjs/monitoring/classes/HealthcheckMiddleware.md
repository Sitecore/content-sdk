[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [monitoring](../README.md) / HealthcheckMiddleware

# Class: HealthcheckMiddleware

<<<<<<< HEAD
Defined in: [nextjs/src/monitoring/healthcheck-middleware.ts:6](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/monitoring/healthcheck-middleware.ts#L6)
=======
Defined in: [nextjs/src/monitoring/healthcheck-middleware.ts:6](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/monitoring/healthcheck-middleware.ts#L6)
>>>>>>> dd686bb50 (Update API docs)

Middleware / handler for use in healthcheck Next.js API route (e.g. '/api/healthz').

## Constructors

### Constructor

> **new HealthcheckMiddleware**(): `HealthcheckMiddleware`

#### Returns

`HealthcheckMiddleware`

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

<<<<<<< HEAD
Defined in: [nextjs/src/monitoring/healthcheck-middleware.ts:11](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/nextjs/src/monitoring/healthcheck-middleware.ts#L11)
=======
Defined in: [nextjs/src/monitoring/healthcheck-middleware.ts:11](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/nextjs/src/monitoring/healthcheck-middleware.ts#L11)
>>>>>>> dd686bb50 (Update API docs)

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
