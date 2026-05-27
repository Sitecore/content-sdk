[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [index](../README.md) / AnalyticsPlugin

# Interface: AnalyticsPlugin

Defined in: [analytics-core/src/initialization/types.ts:81](https://github.com/Sitecore/content-sdk/blob/932dec9d0ea130c3f620b32f2a21cb0a49bd0481/packages/analytics-core/src/initialization/types.ts#L81)

Defines the structure of the analytics plugin, including its initialization method, name, options, and adapter.

## Extends

- `Plugin`

## Properties

### adapter

> **adapter**: [`AnalyticsAdapter`](../../internal/interfaces/AnalyticsAdapter.md)

Defined in: [analytics-core/src/initialization/types.ts:89](https://github.com/Sitecore/content-sdk/blob/932dec9d0ea130c3f620b32f2a21cb0a49bd0481/packages/analytics-core/src/initialization/types.ts#L89)

The adapter for the analytics plugin, which provides methods to get and set the client ID, and access location search parameters. The adapter allows the analytics plugin to interact with the underlying platform or environment in a consistent way.

#### Overrides

`Plugin.adapter`

***

### dependencies?

> `optional` **dependencies?**: `string`[]

Defined in: core/types/initialization/types.d.ts:71

List of plugins this plugin depends on

#### Inherited from

`Plugin.dependencies`

***

### init

> **init**: () => `Promise`\<`void`\>

Defined in: [analytics-core/src/initialization/types.ts:94](https://github.com/Sitecore/content-sdk/blob/932dec9d0ea130c3f620b32f2a21cb0a49bd0481/packages/analytics-core/src/initialization/types.ts#L94)

Initializes the analytics plugin, which may involve setting up necessary configurations, loading scripts, or performing any asynchronous operations required for the plugin to function properly.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the initialization is complete.

#### Overrides

`Plugin.init`

***

### name

> **name**: `"AnalyticsPlugin"`

Defined in: [analytics-core/src/initialization/types.ts:98](https://github.com/Sitecore/content-sdk/blob/932dec9d0ea130c3f620b32f2a21cb0a49bd0481/packages/analytics-core/src/initialization/types.ts#L98)

The name of the analytics plugin.

#### Overrides

`Plugin.name`

***

### options

> **options**: [`AnalyticsOptions`](../../internal/interfaces/AnalyticsOptions.md)

Defined in: [analytics-core/src/initialization/types.ts:85](https://github.com/Sitecore/content-sdk/blob/932dec9d0ea130c3f620b32f2a21cb0a49bd0481/packages/analytics-core/src/initialization/types.ts#L85)

The options for the analytics plugin.

#### Overrides

`Plugin.options`
