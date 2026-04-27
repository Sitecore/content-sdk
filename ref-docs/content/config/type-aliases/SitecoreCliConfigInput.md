[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

Defined in: [content/src/config/models.ts:231](https://github.com/Sitecore/content-sdk/blob/855bd4d7f25d36c9c4a22021da6d73fb13ad812f/packages/content/src/config/models.ts#L231)

Type used as CLI config input in sitecore.cli.config

## Properties

### build?

> `optional` **build?**: `object`

Defined in: [content/src/config/models.ts:239](https://github.com/Sitecore/content-sdk/blob/855bd4d7f25d36c9c4a22021da6d73fb13ad812f/packages/content/src/config/models.ts#L239)

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

Defined in: [content/src/config/models.ts:257](https://github.com/Sitecore/content-sdk/blob/855bd4d7f25d36c9c4a22021da6d73fb13ad812f/packages/content/src/config/models.ts#L257)

Configuration for the `sitecore-tools component generate-map` CLI command

#### Type Declaration

##### generator?

> `optional` **generator?**: [`GenerateMapFunction`](../../tools/type-aliases/GenerateMapFunction.md)

Function implementation for generating a component map

***

### config

> **config**: [`SitecoreConfig`](SitecoreConfig.md)

Defined in: [content/src/config/models.ts:235](https://github.com/Sitecore/content-sdk/blob/855bd4d7f25d36c9c4a22021da6d73fb13ad812f/packages/content/src/config/models.ts#L235)

Sitecore configuration (`sitecore.config` file)

***

### scaffold?

> `optional` **scaffold?**: `object`

Defined in: [content/src/config/models.ts:248](https://github.com/Sitecore/content-sdk/blob/855bd4d7f25d36c9c4a22021da6d73fb13ad812f/packages/content/src/config/models.ts#L248)

Configuration for the `sitecore-tools scaffold` CLI command

#### templates?

> `optional` **templates?**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

Scaffold templates available for generating components
