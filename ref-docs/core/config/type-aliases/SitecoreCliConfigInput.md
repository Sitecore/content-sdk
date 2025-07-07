[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

Defined in: [packages/core/src/config/models.ts:206](https://github.com/Sitecore/content-sdk/blob/e03c141afbcc338bafc2f906aa1812ce7c25a2ae/packages/core/src/config/models.ts#L206)

Type used as CLI config input in sitecore.cli.config

## Properties

### build?

> `optional` **build**: `object`

Defined in: [packages/core/src/config/models.ts:210](https://github.com/Sitecore/content-sdk/blob/e03c141afbcc338bafc2f906aa1812ce7c25a2ae/packages/core/src/config/models.ts#L210)

Configuration for the `sitecore-tools build` CLI command

#### commands?

> `optional` **commands**: () => `Promise`\<`void`\>[]

Commands to run during the build process

##### Returns

`Promise`\<`void`\>

***

### componentMap?

> `optional` **componentMap**: [`GenerateMapArgs`](../../tools/type-aliases/GenerateMapArgs.md) & `object`

Defined in: [packages/core/src/config/models.ts:228](https://github.com/Sitecore/content-sdk/blob/e03c141afbcc338bafc2f906aa1812ce7c25a2ae/packages/core/src/config/models.ts#L228)

Configuration for the `sitecore-tools component generate-map` CLI command

#### Type declaration

##### generator?

> `optional` **generator**: [`GenerateMapFunction`](../../tools/type-aliases/GenerateMapFunction.md)

Function implementation for generating a component map

***

### scaffold?

> `optional` **scaffold**: `object`

Defined in: [packages/core/src/config/models.ts:219](https://github.com/Sitecore/content-sdk/blob/e03c141afbcc338bafc2f906aa1812ce7c25a2ae/packages/core/src/config/models.ts#L219)

Configuration for the `sitecore-tools scaffold` CLI command

#### templates?

> `optional` **templates**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

Scaffold templates available for generating components
