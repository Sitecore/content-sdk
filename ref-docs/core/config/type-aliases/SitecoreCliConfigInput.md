[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

Defined in: [packages/core/src/config/models.ts:209](https://github.com/Sitecore/content-sdk/blob/4718c57eef4fce4cbd4fccde85fd3dbc1d92f525/packages/core/src/config/models.ts#L209)

Type used as CLI config input in sitecore.cli.config

## Properties

### build?

> `optional` **build**: `object`

Defined in: [packages/core/src/config/models.ts:213](https://github.com/Sitecore/content-sdk/blob/4718c57eef4fce4cbd4fccde85fd3dbc1d92f525/packages/core/src/config/models.ts#L213)

Configuration for the `sitecore-tools build` CLI command

#### commands?

> `optional` **commands**: () => `Promise`\<`void`\>[]

Commands to run during the build process

##### Returns

`Promise`\<`void`\>

***

### componentMap?

> `optional` **componentMap**: [`GenerateMapArgs`](../../tools/type-aliases/GenerateMapArgs.md) & `object`

Defined in: [packages/core/src/config/models.ts:231](https://github.com/Sitecore/content-sdk/blob/4718c57eef4fce4cbd4fccde85fd3dbc1d92f525/packages/core/src/config/models.ts#L231)

Configuration for the `sitecore-tools component generate-map` CLI command

#### Type declaration

##### generator?

> `optional` **generator**: [`GenerateMapFunction`](../../tools/type-aliases/GenerateMapFunction.md)

Function implementation for generating a component map

***

### scaffold?

> `optional` **scaffold**: `object`

Defined in: [packages/core/src/config/models.ts:222](https://github.com/Sitecore/content-sdk/blob/4718c57eef4fce4cbd4fccde85fd3dbc1d92f525/packages/core/src/config/models.ts#L222)

Configuration for the `sitecore-tools scaffold` CLI command

#### templates?

> `optional` **templates**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

Scaffold templates available for generating components
