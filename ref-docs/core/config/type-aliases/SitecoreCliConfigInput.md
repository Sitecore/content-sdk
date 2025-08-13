[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

Defined in: [packages/core/src/config/models.ts:211](https://github.com/Sitecore/content-sdk/blob/58c317bf66fa2e948a2a500869b58b4eeaa19046/packages/core/src/config/models.ts#L211)

Type used as CLI config input in sitecore.cli.config

## Properties

### build?

> `optional` **build**: `object`

Defined in: [packages/core/src/config/models.ts:215](https://github.com/Sitecore/content-sdk/blob/58c317bf66fa2e948a2a500869b58b4eeaa19046/packages/core/src/config/models.ts#L215)

Configuration for the `sitecore-tools build` CLI command

#### commands?

> `optional` **commands**: () => `Promise`\<`void`\>[]

Commands to run during the build process

##### Returns

`Promise`\<`void`\>

***

### componentMap?

> `optional` **componentMap**: [`GenerateMapArgs`](../../tools/type-aliases/GenerateMapArgs.md) & `object`

Defined in: [packages/core/src/config/models.ts:233](https://github.com/Sitecore/content-sdk/blob/58c317bf66fa2e948a2a500869b58b4eeaa19046/packages/core/src/config/models.ts#L233)

Configuration for the `sitecore-tools component generate-map` CLI command

#### Type declaration

##### generator?

> `optional` **generator**: [`GenerateMapFunction`](../../tools/type-aliases/GenerateMapFunction.md)

Function implementation for generating a component map

***

### scaffold?

> `optional` **scaffold**: `object`

Defined in: [packages/core/src/config/models.ts:224](https://github.com/Sitecore/content-sdk/blob/58c317bf66fa2e948a2a500869b58b4eeaa19046/packages/core/src/config/models.ts#L224)

Configuration for the `sitecore-tools scaffold` CLI command

#### templates?

> `optional` **templates**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

Scaffold templates available for generating components
