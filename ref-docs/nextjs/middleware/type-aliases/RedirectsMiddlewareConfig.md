[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / RedirectsMiddlewareConfig

# Type Alias: RedirectsMiddlewareConfig

> **RedirectsMiddlewareConfig** = `Omit`\<[`RedirectsServiceConfig`](../../index/type-aliases/RedirectsServiceConfig.md), `"fetch"` \| `"clientFactory"`\> & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & [`MiddlewareBaseConfig`](MiddlewareBaseConfig.md) & `SitecoreConfig`\[`"redirects"`\] & `object`

Defined in: [nextjs/src/middleware/redirects-middleware.ts:31](https://github.com/Sitecore/content-sdk/blob/1895b0f9c2d1368b07383f85311d808a73aac7bd/packages/nextjs/src/middleware/redirects-middleware.ts#L31)

extended RedirectsMiddlewareConfig config type for RedirectsMiddleware

## Type declaration

### redirectsService?

> `optional` **redirectsService**: [`RedirectsService`](../../index/classes/RedirectsService.md)
