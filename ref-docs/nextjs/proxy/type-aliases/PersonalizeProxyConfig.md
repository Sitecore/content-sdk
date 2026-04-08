[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / PersonalizeProxyConfig

# Type Alias: PersonalizeProxyConfig

> **PersonalizeProxyConfig** = [`ProxyBaseConfig`](ProxyBaseConfig.md) & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `SitecoreConfig`\[`"personalize"`\] & `object`

Defined in: [nextjs/src/proxy/personalize-proxy.ts:34](https://github.com/Sitecore/content-sdk/blob/b92d240245a7da53f462f7bcffe6086a3971978d/packages/nextjs/src/proxy/personalize-proxy.ts#L34)

The interface for the PersonalizeProxy configuration.

## Type Declaration

### extractGeoDataCb?

> `optional` **extractGeoDataCb?**: (`req?`) => `Promise`\<[`PersonalizeGeoData`](../../index/type-aliases/PersonalizeGeoData.md)\> \| [`PersonalizeGeoData`](../../index/type-aliases/PersonalizeGeoData.md)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req?` | `NextRequest` |

#### Returns

`Promise`\<[`PersonalizeGeoData`](../../index/type-aliases/PersonalizeGeoData.md)\> \| [`PersonalizeGeoData`](../../index/type-aliases/PersonalizeGeoData.md)

### getExtraUtmParams?

> `optional` **getExtraUtmParams?**: (`req`) => `Partial`\<`ExperienceParams`\[`"utm"`\]\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Partial`\<`ExperienceParams`\[`"utm"`\]\>

### personalizeService?

> `optional` **personalizeService?**: [`PersonalizeService`](../../index/classes/PersonalizeService.md)

### skipForBot?

> `optional` **skipForBot?**: `boolean`

Skip personalize proxy for bot requests marked by the bot tracking proxy.
Default is `true`.
