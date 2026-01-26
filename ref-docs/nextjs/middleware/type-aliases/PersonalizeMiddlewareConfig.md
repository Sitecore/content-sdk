[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / PersonalizeMiddlewareConfig

# Type Alias: PersonalizeMiddlewareConfig

> **PersonalizeMiddlewareConfig** = [`MiddlewareBaseConfig`](MiddlewareBaseConfig.md) & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `SitecoreConfig`\[`"personalize"`\] & `object`

Defined in: [nextjs/src/middleware/personalize-middleware.ts:28](https://github.com/Sitecore/content-sdk/blob/0201c98750f9b9a280b6f5f642cfd58fba22afc7/packages/nextjs/src/middleware/personalize-middleware.ts#L28)

The interface for the PersonalizeMiddleware configuration.

## Type declaration

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
