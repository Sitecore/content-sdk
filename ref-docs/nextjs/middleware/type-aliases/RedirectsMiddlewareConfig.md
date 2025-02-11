[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / RedirectsMiddlewareConfig

# Type Alias: RedirectsMiddlewareConfig

> **RedirectsMiddlewareConfig**: `Omit`\<`GraphQLRedirectsServiceConfig`, `"fetch"`\> & [`MiddlewareBaseConfig`](MiddlewareBaseConfig.md) & `object`

Defined in: [nextjs/src/middleware/redirects-middleware.ts:30](https://github.com/Sitecore/xmc-jss-dev/blob/ecfb4b66ff16c45f596cda74396c27d7d39de5a5/packages/nextjs/src/middleware/redirects-middleware.ts#L30)

extended RedirectsMiddlewareConfig config type for RedirectsMiddleware

## Type declaration

### locales

> **locales**: `string`[]

These are all the locales you support in your application.
These should match those in your next.config.js (i18n.locales).
