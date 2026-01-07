[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / PersonalizeMiddlewareConfig

# Type Alias: PersonalizeMiddlewareConfig

> **PersonalizeMiddlewareConfig** = [`MiddlewareBaseConfig`](MiddlewareBaseConfig.md) & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `SitecoreConfig`\[`"personalize"`\] & `object`

Defined in: [nextjs/src/middleware/personalize-middleware.ts:28](https://github.com/Sitecore/content-sdk/blob/a92cd174849c6a63e55e22ffdf4753663b81fab9/packages/nextjs/src/middleware/personalize-middleware.ts#L28)

The interface for the PersonalizeMiddleware configuration.

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
