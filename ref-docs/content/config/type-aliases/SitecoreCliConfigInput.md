[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

Defined in: [content/src/config/models.ts:233](https://github.com/Sitecore/content-sdk/blob/2b0c7c2dea4daf4d4e45b5113312f81087c2ba09/packages/content/src/config/models.ts#L233)

Type used as CLI config input in sitecore.cli.config

## Properties

### build?

> `optional` **build?**: `object`

Defined in: [content/src/config/models.ts:241](https://github.com/Sitecore/content-sdk/blob/2b0c7c2dea4daf4d4e45b5113312f81087c2ba09/packages/content/src/config/models.ts#L241)

Configuration for the `sitecore-tools build` CLI command

#### commands?

> `optional` **commands?**: (`args?`) => `Promise`\<`void`\>[]

Commands to run during the build process

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `args?` | \{ `scConfig`: [`SitecoreConfig`](SitecoreConfig.md); \} |
| `args.scConfig?` | [`SitecoreConfig`](SitecoreConfig.md) |

##### Returns

`Promise`\<`void`\>

***

### componentMap?

> `optional` **componentMap?**: [`GenerateMapArgs`](../../tools/type-aliases/GenerateMapArgs.md) & `object`

Defined in: [content/src/config/models.ts:259](https://github.com/Sitecore/content-sdk/blob/2b0c7c2dea4daf4d4e45b5113312f81087c2ba09/packages/content/src/config/models.ts#L259)

Configuration for the `sitecore-tools component generate-map` CLI command

#### Type Declaration

##### generator?

> `optional` **generator?**: [`GenerateMapFunction`](../../tools/type-aliases/GenerateMapFunction.md)

Function implementation for generating a component map

***

### config

> **config**: [`SitecoreConfig`](SitecoreConfig.md)

Defined in: [content/src/config/models.ts:237](https://github.com/Sitecore/content-sdk/blob/2b0c7c2dea4daf4d4e45b5113312f81087c2ba09/packages/content/src/config/models.ts#L237)

Sitecore configuration (`sitecore.config` file)

***

### scaffold?

> `optional` **scaffold?**: `object`

Defined in: [content/src/config/models.ts:250](https://github.com/Sitecore/content-sdk/blob/2b0c7c2dea4daf4d4e45b5113312f81087c2ba09/packages/content/src/config/models.ts#L250)

Configuration for the `sitecore-tools scaffold` CLI command

#### templates?

> `optional` **templates?**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

Scaffold templates available for generating components
