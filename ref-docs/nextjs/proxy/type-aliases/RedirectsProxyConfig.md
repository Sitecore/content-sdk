[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / RedirectsProxyConfig

# Type Alias: RedirectsProxyConfig

> **RedirectsProxyConfig** = `Omit`\<[`RedirectsServiceConfig`](../../index/type-aliases/RedirectsServiceConfig.md), `"fetch"` \| `"clientFactory"`\> & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `Partial`\<`NonNullable`\<`SitecoreConfig`\[`"api"`\]\[`"local"`\]\>\> & [`ProxyBaseConfig`](ProxyBaseConfig.md) & `SitecoreConfig`\[`"redirects"`\] & `object`

Defined in: [nextjs/src/proxy/redirects-proxy.ts:32](https://github.com/Sitecore/content-sdk/blob/dca81790520720d9e179a738163a316f911b36d8/packages/nextjs/src/proxy/redirects-proxy.ts#L32)

The interface for the RedirectsProxy configuration.

## Type Declaration

### redirectsService?

> `optional` **redirectsService**: [`RedirectsService`](../../index/classes/RedirectsService.md)
