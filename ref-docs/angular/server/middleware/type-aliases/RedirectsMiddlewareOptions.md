[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / RedirectsMiddlewareOptions

# Type Alias: RedirectsMiddlewareOptions

> **RedirectsMiddlewareOptions** = [`BaseMiddlewareOptions`](../interfaces/BaseMiddlewareOptions.md) & `Omit`\<`RedirectsServiceConfig`, `"fetch"` \| `"clientFactory"`\> & `Partial`\<[`SitecoreConfig`](../content/config/type-aliases/SitecoreConfig.md)\[`"api"`\]\[`"edge"`\]\> & `Partial`\<`NonNullable`\<[`SitecoreConfig`](../content/config/type-aliases/SitecoreConfig.md)\[`"api"`\]\[`"local"`\]\>\> & [`SitecoreConfig`](../content/config/type-aliases/SitecoreConfig.md)\[`"redirects"`\] & `object`

Defined in: [packages/angular/src/server/middleware/redirects-middleware.ts:39](https://github.com/Sitecore/content-sdk/blob/9329e6e2d33c2b5d7d6c8bef29aa6663d4bb5a71/packages/angular/src/server/middleware/redirects-middleware.ts#L39)

Configuration for the redirects middleware.

## Type Declaration

### defaultLanguage?

> `optional` **defaultLanguage?**: `string`

Fallback language when the request path has no locale prefix. Default is `'en'`.

### defaultSite?

> `optional` **defaultSite?**: `string`

Fallback site name when not resolved by the multisite middleware or site cookie.

### redirectsService?

> `optional` **redirectsService?**: `RedirectsService`

Override the redirects service instance (e.g. for testing).

### sites?

> `optional` **sites?**: `SiteInfo`[]

Sites used to resolve the site's default language for the `$siteLang` token.
