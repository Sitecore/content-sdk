[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / PersonalizeProxyConfig

# Type Alias: PersonalizeProxyConfig

> **PersonalizeProxyConfig** = [`ProxyBaseConfig`](ProxyBaseConfig.md) & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `SitecoreConfig`\[`"personalize"`\] & `object`

Defined in: [nextjs/src/proxy/personalize-proxy.ts:45](https://github.com/Sitecore/content-sdk/blob/875d6d993172f5a390ee9cc4907a6dde260ec447/packages/nextjs/src/proxy/personalize-proxy.ts#L45)

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
