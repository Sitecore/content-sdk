[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / RedirectsProxyConfig

# Type Alias: RedirectsProxyConfig

> **RedirectsProxyConfig** = `Omit`\<[`RedirectsServiceConfig`](../../index/type-aliases/RedirectsServiceConfig.md), `"fetch"` \| `"clientFactory"`\> & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `Partial`\<`NonNullable`\<`SitecoreConfig`\[`"api"`\]\[`"local"`\]\>\> & [`ProxyBaseConfig`](ProxyBaseConfig.md) & `SitecoreConfig`\[`"redirects"`\] & `object`

Defined in: [nextjs/src/proxy/redirects-proxy.ts:39](https://github.com/Sitecore/content-sdk/blob/84866ded66f6f8f69e7f007b2311494e086b493b/packages/nextjs/src/proxy/redirects-proxy.ts#L39)

The interface for the RedirectsProxy configuration.

## Type Declaration

### redirectsService?

> `optional` **redirectsService?**: [`RedirectsService`](../../index/classes/RedirectsService.md)
