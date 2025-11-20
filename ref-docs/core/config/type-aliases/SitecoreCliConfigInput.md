[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

Defined in: [packages/core/src/config/models.ts:225](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/core/src/config/models.ts#L225)

Type used as CLI config input in sitecore.cli.config

## Properties

### build?

> `optional` **build**: `object`

Defined in: [packages/core/src/config/models.ts:233](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/core/src/config/models.ts#L233)

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

Defined in: [packages/core/src/config/models.ts:251](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/core/src/config/models.ts#L251)

Configuration for the `sitecore-tools component generate-map` CLI command

#### Type declaration

##### generator?

> `optional` **generator**: [`GenerateMapFunction`](../../tools/type-aliases/GenerateMapFunction.md)

Function implementation for generating a component map

***

### config?

> `optional` **config**: [`SitecoreConfig`](SitecoreConfig.md)

Defined in: [packages/core/src/config/models.ts:229](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/core/src/config/models.ts#L229)

Sitecore configuration (`sitecore.config` file)

***

### scaffold?

> `optional` **scaffold**: `object`

Defined in: [packages/core/src/config/models.ts:242](https://github.com/Sitecore/content-sdk/blob/66c36d02e82e2d6af837d7bc73eac8efc8179d04/packages/core/src/config/models.ts#L242)

Configuration for the `sitecore-tools scaffold` CLI command

#### templates?

> `optional` **templates**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

Scaffold templates available for generating components
