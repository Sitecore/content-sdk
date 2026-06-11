[**@sitecore-content-sdk/personalize**](../../README.md)

***

[@sitecore-content-sdk/personalize](../../README.md) / [internal](../README.md) / PersonalizeServerPlugin

# Interface: PersonalizeServerPlugin

Defined in: [personalize/src/initialization/types.ts:132](https://github.com/Sitecore/content-sdk/blob/3dc5fa6a9ffea34ed539648d3e2e8ac2ce4bf5a4/packages/personalize/src/initialization/types.ts#L132)

Represents the personalize server plugin interface.

## Properties

### adapter

> **adapter**: [`PersonalizeAdapter`](PersonalizeAdapter.md)

Defined in: [personalize/src/initialization/types.ts:153](https://github.com/Sitecore/content-sdk/blob/3dc5fa6a9ffea34ed539648d3e2e8ac2ce4bf5a4/packages/personalize/src/initialization/types.ts#L153)

The adapter for the personalize server plugin, which provides methods to get and set the profile id, and optionally get the user agent. The adapter allows the personalize plugin to interact with the underlying platform or environment in a consistent way.

***

### dependencies

> **dependencies**: `string`[]

Defined in: [personalize/src/initialization/types.ts:149](https://github.com/Sitecore/content-sdk/blob/3dc5fa6a9ffea34ed539648d3e2e8ac2ce4bf5a4/packages/personalize/src/initialization/types.ts#L149)

An array of plugin names that the personalize server plugin depends on. This ensures that the required plugins are initialized before the personalize plugin is initialized.

***

### init

> **init**: () => `Promise`\<`void`\>

Defined in: [personalize/src/initialization/types.ts:141](https://github.com/Sitecore/content-sdk/blob/3dc5fa6a9ffea34ed539648d3e2e8ac2ce4bf5a4/packages/personalize/src/initialization/types.ts#L141)

Initializes the personalize server plugin, which may involve setting up necessary configurations or performing any asynchronous operations required for the plugin to function properly.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the initialization is complete.

***

### name

> **name**: `"PersonalizePlugin"`

Defined in: [personalize/src/initialization/types.ts:145](https://github.com/Sitecore/content-sdk/blob/3dc5fa6a9ffea34ed539648d3e2e8ac2ce4bf5a4/packages/personalize/src/initialization/types.ts#L145)

The name of the personalize plugin.

***

### options

> **options**: [`PersonalizeServerOptions`](../type-aliases/PersonalizeServerOptions.md)

Defined in: [personalize/src/initialization/types.ts:136](https://github.com/Sitecore/content-sdk/blob/3dc5fa6a9ffea34ed539648d3e2e8ac2ce4bf5a4/packages/personalize/src/initialization/types.ts#L136)

The options for the personalize server plugin, including cookie settings.
