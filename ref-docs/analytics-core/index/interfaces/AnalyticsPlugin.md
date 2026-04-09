[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [index](../README.md) / AnalyticsPlugin

# Interface: AnalyticsPlugin

Defined in: [analytics-core/src/initialization/types.ts:76](https://github.com/Sitecore/content-sdk/blob/dab46fcff27d61ada73abfddf39ca90f19ebc3b9/packages/analytics-core/src/initialization/types.ts#L76)

Defines the structure of the analytics plugin, including its initialization method, name, options, and adapter.

## Extends

- `Plugin`

## Properties

### adapter

> **adapter**: [`AnalyticsAdapter`](../../internal/interfaces/AnalyticsAdapter.md)

Defined in: [analytics-core/src/initialization/types.ts:84](https://github.com/Sitecore/content-sdk/blob/dab46fcff27d61ada73abfddf39ca90f19ebc3b9/packages/analytics-core/src/initialization/types.ts#L84)

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

Defined in: [analytics-core/src/initialization/types.ts:89](https://github.com/Sitecore/content-sdk/blob/dab46fcff27d61ada73abfddf39ca90f19ebc3b9/packages/analytics-core/src/initialization/types.ts#L89)

Initializes the analytics plugin, which may involve setting up necessary configurations, loading scripts, or performing any asynchronous operations required for the plugin to function properly.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the initialization is complete.

#### Overrides

`Plugin.init`

***

### name

> **name**: `"AnalyticsPlugin"`

Defined in: [analytics-core/src/initialization/types.ts:93](https://github.com/Sitecore/content-sdk/blob/dab46fcff27d61ada73abfddf39ca90f19ebc3b9/packages/analytics-core/src/initialization/types.ts#L93)

The name of the analytics plugin.

#### Overrides

`Plugin.name`

***

### options

> **options**: [`AnalyticsOptions`](../../internal/interfaces/AnalyticsOptions.md)

Defined in: [analytics-core/src/initialization/types.ts:80](https://github.com/Sitecore/content-sdk/blob/dab46fcff27d61ada73abfddf39ca90f19ebc3b9/packages/analytics-core/src/initialization/types.ts#L80)

The options for the analytics plugin.

#### Overrides

`Plugin.options`
