[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [middleware](../README.md) / PersonalizeMiddlewareConfig

# Type Alias: PersonalizeMiddlewareConfig

> **PersonalizeMiddlewareConfig** = [`MiddlewareBaseConfig`](MiddlewareBaseConfig.md) & `SitecoreConfig`\[`"api"`\]\[`"edge"`\] & `SitecoreConfig`\[`"personalize"`\] & `object`

Defined in: [nextjs/src/middleware/personalize-middleware.ts:15](https://github.com/Sitecore/xmc-jss-dev/blob/e071b5c5bcc29ad3f8f0d1250181261d976b39d1/packages/nextjs/src/middleware/personalize-middleware.ts#L15)

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

> `optional` **personalizeService**: [`GraphQLPersonalizeService`](../../index/classes/GraphQLPersonalizeService.md)
