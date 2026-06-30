[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [internal](../README.md) / PersonalizeBrowserPlugin

# Interface: PersonalizeBrowserPlugin

Defined in: [personalize/src/initialization/types.ts:104](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/personalize/src/initialization/types.ts#L104)

Represents the personalize browser plugin interface.

## Properties

### adapter

> **adapter**: [`PersonalizeAdapter`](PersonalizeAdapter.md)

Defined in: [personalize/src/initialization/types.ts:125](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/personalize/src/initialization/types.ts#L125)

The adapter for the personalize browser plugin, which provides methods to get and set the profile id, and optionally get the user agent. The adapter allows the personalize plugin to interact with the underlying platform or environment in a consistent way.

***

### dependencies

> **dependencies**: `string`[]

Defined in: [personalize/src/initialization/types.ts:121](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/personalize/src/initialization/types.ts#L121)

An array of plugin names that the personalize browser plugin depends on. This ensures that the required plugins are initialized before the personalize plugin is initialized.

***

### init

> **init**: () => `Promise`\<`void`\>

Defined in: [personalize/src/initialization/types.ts:113](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/personalize/src/initialization/types.ts#L113)

Initializes the personalize browser plugin, which may involve setting up necessary configurations, loading scripts, or performing any asynchronous operations required for the plugin to function properly.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the initialization is complete.

***

### name

> **name**: `"PersonalizePlugin"`

Defined in: [personalize/src/initialization/types.ts:117](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/personalize/src/initialization/types.ts#L117)

The name of the personalize plugin.

***

### options

> **options**: [`PersonalizeOptions`](PersonalizeOptions.md)

Defined in: [personalize/src/initialization/types.ts:108](https://github.com/Sitecore/content-sdk/blob/bcebed4474f8688a76cf336fc140f0418499ac2f/packages/personalize/src/initialization/types.ts#L108)

The options for the personalize browser plugin, including web personalization and cookie settings.
