[**@sitecore-content-sdk/angular**](../../../README.md)

***

[@sitecore-content-sdk/angular](../../../README.md) / [server/middleware](../README.md) / PersonalizeMiddlewareOptions

# Type Alias: PersonalizeMiddlewareOptions

> **PersonalizeMiddlewareOptions** = [`BaseMiddlewareOptions`](../interfaces/BaseMiddlewareOptions.md) & `Partial`\<`SitecoreConfig`\[`"personalize"`\]\> & `Partial`\<`SitecoreConfig`\[`"api"`\]\[`"edge"`\]\> & `object`

Defined in: [packages/angular/src/server/middleware/personalize-middleware.ts:62](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/angular/src/server/middleware/personalize-middleware.ts#L62)

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

### skipForBot?

> `optional` **skipForBot?**: `boolean`

Skip personalization for bot requests marked by the bot tracking middleware. Default `true`.
