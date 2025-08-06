[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

<<<<<<< HEAD
Defined in: [packages/core/src/config/models.ts:211](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/config/models.ts#L211)
=======
Defined in: [packages/core/src/config/models.ts:211](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/config/models.ts#L211)
>>>>>>> dd686bb50 (Update API docs)

Type used as CLI config input in sitecore.cli.config

## Properties

### build?

> `optional` **build**: `object`

<<<<<<< HEAD
Defined in: [packages/core/src/config/models.ts:215](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/config/models.ts#L215)
=======
Defined in: [packages/core/src/config/models.ts:215](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/config/models.ts#L215)
>>>>>>> dd686bb50 (Update API docs)

Configuration for the `sitecore-tools build` CLI command

#### commands?

> `optional` **commands**: () => `Promise`\<`void`\>[]

Commands to run during the build process

##### Returns

`Promise`\<`void`\>

***

### componentMap?

> `optional` **componentMap**: [`GenerateMapArgs`](../../tools/type-aliases/GenerateMapArgs.md) & `object`

<<<<<<< HEAD
Defined in: [packages/core/src/config/models.ts:233](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/config/models.ts#L233)
=======
Defined in: [packages/core/src/config/models.ts:233](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/config/models.ts#L233)
>>>>>>> dd686bb50 (Update API docs)

Configuration for the `sitecore-tools component generate-map` CLI command

#### Type declaration

##### generator?

> `optional` **generator**: [`GenerateMapFunction`](../../tools/type-aliases/GenerateMapFunction.md)

Function implementation for generating a component map

***

### scaffold?

> `optional` **scaffold**: `object`

<<<<<<< HEAD
Defined in: [packages/core/src/config/models.ts:224](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/config/models.ts#L224)
=======
Defined in: [packages/core/src/config/models.ts:224](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/config/models.ts#L224)
>>>>>>> dd686bb50 (Update API docs)

Configuration for the `sitecore-tools scaffold` CLI command

#### templates?

> `optional` **templates**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

Scaffold templates available for generating components
