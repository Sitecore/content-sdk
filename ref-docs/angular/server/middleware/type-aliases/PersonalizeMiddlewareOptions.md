[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / PersonalizeMiddlewareOptions

# Type Alias: PersonalizeMiddlewareOptions

> **PersonalizeMiddlewareOptions** = [`BaseMiddlewareOptions`](../interfaces/BaseMiddlewareOptions.md) & `Partial`\<[`SitecoreConfig`](../content/config/type-aliases/SitecoreConfig.md)\[`"personalize"`\]\> & `Partial`\<[`SitecoreConfig`](../content/config/type-aliases/SitecoreConfig.md)\[`"api"`\]\[`"edge"`\]\> & `object`

Defined in: [packages/angular/src/server/middleware/personalize-middleware.ts:61](https://github.com/Sitecore/content-sdk/blob/0e7dce683a0be4b8942bf4dc050856cd3c28ba07/packages/angular/src/server/middleware/personalize-middleware.ts#L61)

Configuration for the personalize middleware

## Type Declaration

### defaultLanguage?

> `optional` **defaultLanguage?**: `string`

Fallback language when the request path has no locale prefix. Default is `'en'`

### defaultSite?

> `optional` **defaultSite?**: `string`

Fallback site name when not resolved by the multisite middleware or site cookie

### extractGeoDataCb?

> `optional` **extractGeoDataCb?**: (`req`) => `Promise`\<`PersonalizeGeoData`\> \| `PersonalizeGeoData`

Extract geolocation data from the request

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | [`ExpressRequest`](../interfaces/ExpressRequest.md) |

#### Returns

`Promise`\<`PersonalizeGeoData`\> \| `PersonalizeGeoData`

### getExtraUtmParams?

> `optional` **getExtraUtmParams?**: (`req`) => `Partial`\<`ExperienceParams`\[`"utm"`\]\>

Get extra UTM parameters from the request

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `req` | [`ExpressRequest`](../interfaces/ExpressRequest.md) |

#### Returns

`Partial`\<`ExperienceParams`\[`"utm"`\]\>

### locales?

> `optional` **locales?**: `string`[]

Locales used to extract the language from the request path

### personalizeService?

> `optional` **personalizeService?**: `PersonalizeService`

Override the personalize service instance
