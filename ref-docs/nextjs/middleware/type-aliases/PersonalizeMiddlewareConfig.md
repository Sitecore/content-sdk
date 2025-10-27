[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / PersonalizeMiddlewareConfig

# Type Alias: PersonalizeMiddlewareConfig

> **PersonalizeMiddlewareConfig** = [`MiddlewareBaseConfig`](MiddlewareBaseConfig.md) & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `SitecoreConfig`\[`"personalize"`\] & `object`

Defined in: [nextjs/src/middleware/personalize-middleware.ts:15](https://github.com/Sitecore/content-sdk/blob/3c36d10259ff5fde8a86011b79e6e99deb6497df/packages/nextjs/src/middleware/personalize-middleware.ts#L15)

## Type declaration

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
