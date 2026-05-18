[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / RedirectsProxyConfig

# Type Alias: RedirectsProxyConfig

> **RedirectsProxyConfig** = `Omit`\<[`RedirectsServiceConfig`](../../index/type-aliases/RedirectsServiceConfig.md), `"fetch"` \| `"clientFactory"`\> & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `Partial`\<`NonNullable`\<`SitecoreConfig`\[`"api"`\]\[`"local"`\]\>\> & [`ProxyBaseConfig`](ProxyBaseConfig.md) & `SitecoreConfig`\[`"redirects"`\] & `object`

Defined in: [nextjs/src/proxy/redirects-proxy.ts:31](https://github.com/Sitecore/content-sdk/blob/421d9105c87752d5bb0d388661240bd0d97920b1/packages/nextjs/src/proxy/redirects-proxy.ts#L31)

The interface for the RedirectsProxy configuration.

## Type Declaration

### redirectsService?

> `optional` **redirectsService?**: [`RedirectsService`](../../index/classes/RedirectsService.md)
