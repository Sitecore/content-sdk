[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / RedirectsProxyConfig

# Type Alias: RedirectsProxyConfig

> **RedirectsProxyConfig** = `Omit`\<[`RedirectsServiceConfig`](../../index/type-aliases/RedirectsServiceConfig.md), `"fetch"` \| `"clientFactory"`\> & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `Partial`\<`NonNullable`\<`SitecoreConfig`\[`"api"`\]\[`"local"`\]\>\> & [`ProxyBaseConfig`](ProxyBaseConfig.md) & `SitecoreConfig`\[`"redirects"`\] & `object`

Defined in: [nextjs/src/proxy/redirects-proxy.ts:44](https://github.com/Sitecore/content-sdk/blob/ecba2755393ad3977546ad3dd9af18483599661e/packages/nextjs/src/proxy/redirects-proxy.ts#L44)

The interface for the RedirectsProxy configuration.

## Type Declaration

### redirectsService?

> `optional` **redirectsService?**: [`RedirectsService`](../../index/classes/RedirectsService.md)
