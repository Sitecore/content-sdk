[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

Defined in: [packages/core/src/config/models.ts:209](https://github.com/Sitecore/content-sdk/blob/ecf73abb0aeb2c4507439ed7674a8269fe6542c9/packages/core/src/config/models.ts#L209)

Type used as CLI config input in sitecore.cli.config

## Properties

### build?

> `optional` **build**: `object`

Defined in: [packages/core/src/config/models.ts:217](https://github.com/Sitecore/content-sdk/blob/ecf73abb0aeb2c4507439ed7674a8269fe6542c9/packages/core/src/config/models.ts#L217)

Configuration for the `sitecore-tools build` CLI command

#### commands?

> `optional` **commands**: (`args?`) => `Promise`\<`void`\>[]

Commands to run during the build process

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args?` | \{ `scConfig?`: [`SitecoreConfig`](SitecoreConfig.md); \} |
| `args.scConfig?` | [`SitecoreConfig`](SitecoreConfig.md) |

##### Returns

`Promise`\<`void`\>

***

### componentMap?

> `optional` **componentMap**: [`GenerateMapArgs`](../../tools/type-aliases/GenerateMapArgs.md) & `object`

Defined in: [packages/core/src/config/models.ts:235](https://github.com/Sitecore/content-sdk/blob/ecf73abb0aeb2c4507439ed7674a8269fe6542c9/packages/core/src/config/models.ts#L235)

Configuration for the `sitecore-tools component generate-map` CLI command

#### Type declaration

##### generator?

> `optional` **generator**: [`GenerateMapFunction`](../../tools/type-aliases/GenerateMapFunction.md)

Function implementation for generating a component map

***

### config?

> `optional` **config**: [`SitecoreConfig`](SitecoreConfig.md)

Defined in: [packages/core/src/config/models.ts:213](https://github.com/Sitecore/content-sdk/blob/ecf73abb0aeb2c4507439ed7674a8269fe6542c9/packages/core/src/config/models.ts#L213)

Sitecore configuration (`sitecore.config` file)

***

### scaffold?

> `optional` **scaffold**: `object`

Defined in: [packages/core/src/config/models.ts:226](https://github.com/Sitecore/content-sdk/blob/ecf73abb0aeb2c4507439ed7674a8269fe6542c9/packages/core/src/config/models.ts#L226)

Configuration for the `sitecore-tools scaffold` CLI command

#### templates?

> `optional` **templates**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

Scaffold templates available for generating components
