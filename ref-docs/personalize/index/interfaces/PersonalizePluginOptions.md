[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [index](../README.md) / PersonalizePluginOptions

# Interface: PersonalizePluginOptions

Defined in: [personalize/src/initialization/types.ts:27](https://github.com/Sitecore/content-sdk/blob/304c0001d480de4653718f5e85cd78fc39b272b3/packages/personalize/src/initialization/types.ts#L27)

Parameters for creating a personalize plugin.

## Properties

### enablePersonalizeCookie?

> `optional` **enablePersonalizeCookie**: `boolean`

Defined in: [personalize/src/initialization/types.ts:39](https://github.com/Sitecore/content-sdk/blob/304c0001d480de4653718f5e85cd78fc39b272b3/packages/personalize/src/initialization/types.ts#L39)

Whether to set the sc_cid_personalize cookie.

If using only the browser plugin of the personalize package, set to true.

If using both the browser and the server plugins of the personalize package, set enablePersonalizeCookie to true either on the browser or the server, and set to false on the other.

If enableCookie of analytics plugin is false, enablePersonalizeCookie will not be set.

Default: `false`.

***

### webPersonalization?

> `optional` **webPersonalization**: `boolean` \| `Partial`\<[`WebPersonalizationOptions`](WebPersonalizationOptions.md)\>

Defined in: [personalize/src/initialization/types.ts:49](https://github.com/Sitecore/content-sdk/blob/304c0001d480de4653718f5e85cd78fc39b272b3/packages/personalize/src/initialization/types.ts#L49)

Whether to enable web personalization.

If true, a web personalization script will load in your app with async but without defer.

To customize the loading of the script, set the value to an object, and in the object, use the async, defer, and language attributes.

Default: `false`.
