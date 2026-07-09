[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / EventsPlugin

# Interface: EventsPlugin

Defined in: [events/src/initialization/types.ts:8](https://github.com/Sitecore/content-sdk/blob/407173b8dd1ade15e570175d8b08fef690e7cef9/packages/events/src/initialization/types.ts#L8)

Defines the structure of the events plugin, including its initialization method, name, and dependencies.

## Extends

- `Plugin`

## Properties

### adapter?

> `optional` **adapter?**: `unknown`

Defined in: core/types/initialization/types.d.ts:80

Optional adapter requirements for the plugin.

#### Inherited from

`Plugin.adapter`

***

### dependencies

> **dependencies**: `string`[]

Defined in: [events/src/initialization/types.ts:21](https://github.com/Sitecore/content-sdk/blob/407173b8dd1ade15e570175d8b08fef690e7cef9/packages/events/src/initialization/types.ts#L21)

An array of plugin names that the events plugin depends on. This ensures that the required plugins are initialized before the events plugin is initialized.

#### Overrides

`Plugin.dependencies`

***

### init

> **init**: () => `Promise`\<`void`\>

Defined in: [events/src/initialization/types.ts:13](https://github.com/Sitecore/content-sdk/blob/407173b8dd1ade15e570175d8b08fef690e7cef9/packages/events/src/initialization/types.ts#L13)

Initializes the events plugin, which may involve setting up necessary configurations or performing any asynchronous operations required for the plugin to function properly.

#### Returns

`Promise`\<`void`\>

A promise that resolves when the initialization is complete.

#### Overrides

`Plugin.init`

***

### name

> **name**: `"EventsPlugin"`

Defined in: [events/src/initialization/types.ts:17](https://github.com/Sitecore/content-sdk/blob/407173b8dd1ade15e570175d8b08fef690e7cef9/packages/events/src/initialization/types.ts#L17)

The name of the events plugin.

#### Overrides

`Plugin.name`

***

### options?

> `optional` **options?**: `unknown`

Defined in: core/types/initialization/types.d.ts:67

Optional plugin-specific options

#### Inherited from

`Plugin.options`
