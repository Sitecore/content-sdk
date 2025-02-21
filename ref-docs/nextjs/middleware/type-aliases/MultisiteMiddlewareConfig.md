[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / MultisiteMiddlewareConfig

# Type Alias: MultisiteMiddlewareConfig

> **MultisiteMiddlewareConfig**: [`MiddlewareBaseConfig`](MiddlewareBaseConfig.md) & `object`

Defined in: [nextjs/src/middleware/multisite-middleware.ts:21](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/nextjs/src/middleware/multisite-middleware.ts#L21)

## Type declaration

### useCookieResolution()?

> `optional` **useCookieResolution**: (`req`) => `boolean`

Function used to determine if site should be resolved from sc_site cookie when present

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`boolean`
