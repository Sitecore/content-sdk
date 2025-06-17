[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

Defined in: [packages/core/src/config/models.ts:199](https://github.com/Sitecore/content-sdk/blob/1e3500690040b58b5f3f26b0a33f83b0cfa0d1d1/packages/core/src/config/models.ts#L199)

Type to be used as cli config input in sitecore.cli.config

## Properties

### build?

> `optional` **build**: `object`

Defined in: [packages/core/src/config/models.ts:203](https://github.com/Sitecore/content-sdk/blob/1e3500690040b58b5f3f26b0a33f83b0cfa0d1d1/packages/core/src/config/models.ts#L203)

Configuration for the `sitecore-tools build` cli command

#### commands?

> `optional` **commands**: () => `Promise`\<`void`\>[]

List of commands to run during the build process

##### Returns

`Promise`\<`void`\>

***

### componentMap?

> `optional` **componentMap**: [`GenerateMapArgs`](../../tools/type-aliases/GenerateMapArgs.md) & `object`

Defined in: [packages/core/src/config/models.ts:221](https://github.com/Sitecore/content-sdk/blob/1e3500690040b58b5f3f26b0a33f83b0cfa0d1d1/packages/core/src/config/models.ts#L221)

Configuration for the `sitecore-tools component generate-map` cli command

#### Type declaration

##### generator?

> `optional` **generator**: [`GenerateMapFunction`](../../tools/type-aliases/GenerateMapFunction.md)

Function implementationt for generating a component map.

***

### scaffold?

> `optional` **scaffold**: `object`

Defined in: [packages/core/src/config/models.ts:212](https://github.com/Sitecore/content-sdk/blob/1e3500690040b58b5f3f26b0a33f83b0cfa0d1d1/packages/core/src/config/models.ts#L212)

Configuration for the `sitecore-tools scaffold` cli command

#### templates?

> `optional` **templates**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

List of scaffold templates that can be used for generating components
