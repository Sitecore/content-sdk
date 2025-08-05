[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / RedirectsMiddlewareConfig

# Type Alias: RedirectsMiddlewareConfig

> **RedirectsMiddlewareConfig** = `Omit`\<[`RedirectsServiceConfig`](../../index/type-aliases/RedirectsServiceConfig.md), `"fetch"` \| `"clientFactory"`\> & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & [`MiddlewareBaseConfig`](MiddlewareBaseConfig.md) & `SitecoreConfig`\[`"redirects"`\] & `object`

Defined in: [nextjs/src/middleware/redirects-middleware.ts:31](https://github.com/Sitecore/content-sdk/blob/03f8a1f6efc59b796747b3b90d19db20763447a1/packages/nextjs/src/middleware/redirects-middleware.ts#L31)

extended RedirectsMiddlewareConfig config type for RedirectsMiddleware

## Type declaration

### redirectsService?

> `optional` **redirectsService**: [`RedirectsService`](../../index/classes/RedirectsService.md)
