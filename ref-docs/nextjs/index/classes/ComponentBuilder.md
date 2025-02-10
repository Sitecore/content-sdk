[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / ComponentBuilder

# Class: ComponentBuilder

Defined in: [nextjs/src/ComponentBuilder.ts:37](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/ComponentBuilder.ts#L37)

Nextjs implementation of component builder class for building components based on the configuration.

## Constructors

### new ComponentBuilder()

> **new ComponentBuilder**(`config`): [`ComponentBuilder`](ComponentBuilder.md)

Defined in: [nextjs/src/ComponentBuilder.ts:48](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/ComponentBuilder.ts#L48)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`ComponentBuilderConfig`](../type-aliases/ComponentBuilderConfig.md)\<`Component`\> |

#### Returns

[`ComponentBuilder`](ComponentBuilder.md)

## Properties

### components

> `protected` **components**: `Map`\<`string`, `Component`\>

Defined in: [nextjs/src/ComponentBuilder.ts:41](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/ComponentBuilder.ts#L41)

List of components to be stored

***

### config

> `protected` **config**: [`ComponentBuilderConfig`](../type-aliases/ComponentBuilderConfig.md)\<`Component`\>

Defined in: [nextjs/src/ComponentBuilder.ts:48](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/ComponentBuilder.ts#L48)

***

### DEFAULT\_EXPORT\_NAME

> `protected` **DEFAULT\_EXPORT\_NAME**: `string` = `'Default'`

Defined in: [nextjs/src/ComponentBuilder.ts:46](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/ComponentBuilder.ts#L46)

SXA uses custom default export name

## Methods

### getComponentFactory()

> **getComponentFactory**(`config`?): [`ComponentFactory`](../type-aliases/ComponentFactory.md)

Defined in: [nextjs/src/ComponentBuilder.ts:80](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/ComponentBuilder.ts#L80)

Creates a new instance of component factory
Component can be imported dynamically or statically.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config`? | `ComponentFactoryConfig` | Component factory configuration |

#### Returns

[`ComponentFactory`](../type-aliases/ComponentFactory.md)

Component factory implementation

***

### getModuleFactory()

> **getModuleFactory**(): [`ModuleFactory`](../type-aliases/ModuleFactory.md)

Defined in: [nextjs/src/ComponentBuilder.ts:58](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/nextjs/src/ComponentBuilder.ts#L58)

Creates a new instance of module factory
Module factory provides a module (file) including all exports.
Module can be imported dynamically or statically.

#### Returns

[`ModuleFactory`](../type-aliases/ModuleFactory.md)

Module factory implementation
