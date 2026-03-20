[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / RedirectsProxyConfig

# Type Alias: RedirectsProxyConfig

> **RedirectsProxyConfig** = `Omit`\<[`RedirectsServiceConfig`](../../index/type-aliases/RedirectsServiceConfig.md), `"fetch"` \| `"clientFactory"`\> & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `Partial`\<`NonNullable`\<`SitecoreConfig`\[`"api"`\]\[`"local"`\]\>\> & [`ProxyBaseConfig`](ProxyBaseConfig.md) & `SitecoreConfig`\[`"redirects"`\] & `object`

Defined in: [nextjs/src/proxy/redirects-proxy.ts:32](https://github.com/Sitecore/content-sdk/blob/1f49f65949106a1df6f81df5c5e41772e45f913a/packages/nextjs/src/proxy/redirects-proxy.ts#L32)

The interface for the RedirectsProxy configuration.

## Type Declaration

### redirectsService?

> `optional` **redirectsService**: [`RedirectsService`](../../index/classes/RedirectsService.md)
