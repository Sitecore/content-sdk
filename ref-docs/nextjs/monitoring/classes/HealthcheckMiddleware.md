[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [monitoring](../README.md) / HealthcheckMiddleware

# Class: HealthcheckMiddleware

Defined in: [nextjs/src/monitoring/healthcheck-middleware.ts:7](https://github.com/Sitecore/content-sdk/blob/b4fad5bfdcf00eb3138cebc08959d248545d0a22/packages/nextjs/src/monitoring/healthcheck-middleware.ts#L7)

Middleware / handler for use in healthcheck Next.js API route (e.g. '/api/healthz').

## Constructors

### Constructor

> **new HealthcheckMiddleware**(): `HealthcheckMiddleware`

#### Returns

`HealthcheckMiddleware`

## Methods

### getHandler()

> **getHandler**(): (`req`, `res`) => `Promise`\<`void`\>

Defined in: [nextjs/src/monitoring/healthcheck-middleware.ts:12](https://github.com/Sitecore/content-sdk/blob/b4fad5bfdcf00eb3138cebc08959d248545d0a22/packages/nextjs/src/monitoring/healthcheck-middleware.ts#L12)

Gets the Next.js API route handler

#### Returns

route handler

(`req`, `res`) => `Promise`\<`void`\>
