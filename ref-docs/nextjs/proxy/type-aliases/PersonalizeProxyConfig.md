[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [proxy](../README.md) / PersonalizeProxyConfig

# Type Alias: PersonalizeProxyConfig

> **PersonalizeProxyConfig** = [`ProxyBaseConfig`](ProxyBaseConfig.md) & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `SitecoreConfig`\[`"personalize"`\] & `object`

Defined in: [nextjs/src/proxy/personalize-proxy.ts:28](https://github.com/Sitecore/content-sdk/blob/93fb4095715f238f6ba12b275948e1f3a8215ed2/packages/nextjs/src/proxy/personalize-proxy.ts#L28)

The interface for the PersonalizeProxy configuration.

## Type Declaration

### extractGeoDataCb()?

> `optional` **extractGeoDataCb**: (`req?`) => `Promise`\<`PersonalizeGeoData`\> \| `PersonalizeGeoData`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req?` | `NextRequest` |

#### Returns

`Promise`\<`PersonalizeGeoData`\> \| `PersonalizeGeoData`

### getExtraUtmParams()?

> `optional` **getExtraUtmParams**: (`req`) => `Partial`\<`ExperienceParams`\[`"utm"`\]\>

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | `NextRequest` |

#### Returns

`Partial`\<`ExperienceParams`\[`"utm"`\]\>

### personalizeService?

> `optional` **personalizeService**: [`PersonalizeService`](../../index/classes/PersonalizeService.md)
