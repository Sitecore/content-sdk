[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / Plugin

# Interface: Plugin\<Options, Adapter\>

Defined in: [packages/core/src/initialization/types.ts:58](https://github.com/Sitecore/content-sdk/blob/7b3b3f30369cf56f5de19926b02ee549d98a34dc/packages/core/src/initialization/types.ts#L58)

Plugin interface for extending SDK functionality.
Plugins are the standard way to add capabilities to the SDK.

## Type Parameters

| Type Parameter | Default type | Description |
| ------ | ------ | ------ |
| `Options` | `unknown` | Plugin-specific options type |
| `Adapter` | `unknown` | Plugin-specific adapter type |

## Properties

### adapter?

> `optional` **adapter?**: `Adapter`

Defined in: [packages/core/src/initialization/types.ts:79](https://github.com/Sitecore/content-sdk/blob/7b3b3f30369cf56f5de19926b02ee549d98a34dc/packages/core/src/initialization/types.ts#L79)

Optional adapter requirements for the plugin.

***

### dependencies?

> `optional` **dependencies?**: `string`[]

Defined in: [packages/core/src/initialization/types.ts:70](https://github.com/Sitecore/content-sdk/blob/7b3b3f30369cf56f5de19926b02ee549d98a34dc/packages/core/src/initialization/types.ts#L70)

List of plugins this plugin depends on

***

### init?

> `optional` **init?**: () => `void` \| `Promise`\<`void`\>

Defined in: [packages/core/src/initialization/types.ts:75](https://github.com/Sitecore/content-sdk/blob/7b3b3f30369cf56f5de19926b02ee549d98a34dc/packages/core/src/initialization/types.ts#L75)

Initialization function run once when init is called for the first time.
Can be async for plugins that need to perform async setup.

#### Returns

`void` \| `Promise`\<`void`\>

***

### name

> **name**: `string`

Defined in: [packages/core/src/initialization/types.ts:62](https://github.com/Sitecore/content-sdk/blob/7b3b3f30369cf56f5de19926b02ee549d98a34dc/packages/core/src/initialization/types.ts#L62)

Unique identifier for the plugin (e.g., 'EventsPlugin')

***

### options?

> `optional` **options?**: `Options`

Defined in: [packages/core/src/initialization/types.ts:66](https://github.com/Sitecore/content-sdk/blob/7b3b3f30369cf56f5de19926b02ee549d98a34dc/packages/core/src/initialization/types.ts#L66)

Optional plugin-specific options
