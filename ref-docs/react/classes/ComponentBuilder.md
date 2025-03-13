[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / ComponentBuilder

# Class: ComponentBuilder

Defined in: [packages/react/src/ComponentBuilder.ts:17](https://github.com/Sitecore/xmc-jss-dev/blob/171a564b4cd6bd5a7eef15aa45c0e2689d16cb88/packages/react/src/ComponentBuilder.ts#L17)

React implementation of component builder class for building components based on the configuration.

## Constructors

### new ComponentBuilder()

> **new ComponentBuilder**(`config`): [`ComponentBuilder`](ComponentBuilder.md)

Defined in: [packages/react/src/ComponentBuilder.ts:23](https://github.com/Sitecore/xmc-jss-dev/blob/171a564b4cd6bd5a7eef15aa45c0e2689d16cb88/packages/react/src/ComponentBuilder.ts#L23)

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `config` | [`ComponentBuilderConfig`](../type-aliases/ComponentBuilderConfig.md)\<`ComponentType`\> |

#### Returns

[`ComponentBuilder`](ComponentBuilder.md)

## Properties

### components

> `protected` **components**: `Map`\<`string`, `ComponentType`\>

Defined in: [packages/react/src/ComponentBuilder.ts:21](https://github.com/Sitecore/xmc-jss-dev/blob/171a564b4cd6bd5a7eef15aa45c0e2689d16cb88/packages/react/src/ComponentBuilder.ts#L21)

List of components to be stored

***

### config

> `protected` **config**: [`ComponentBuilderConfig`](../type-aliases/ComponentBuilderConfig.md)\<`ComponentType`\>

Defined in: [packages/react/src/ComponentBuilder.ts:23](https://github.com/Sitecore/xmc-jss-dev/blob/171a564b4cd6bd5a7eef15aa45c0e2689d16cb88/packages/react/src/ComponentBuilder.ts#L23)

## Methods

### getComponentFactory()

> **getComponentFactory**(): [`ComponentFactory`](../type-aliases/ComponentFactory.md)

Defined in: [packages/react/src/ComponentBuilder.ts:31](https://github.com/Sitecore/xmc-jss-dev/blob/171a564b4cd6bd5a7eef15aa45c0e2689d16cb88/packages/react/src/ComponentBuilder.ts#L31)

Creates a new instance of component factory

#### Returns

[`ComponentFactory`](../type-aliases/ComponentFactory.md)

Component factory implementation
