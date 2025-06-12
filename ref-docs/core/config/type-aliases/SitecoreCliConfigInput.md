[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

Defined in: [packages/core/src/config/models.ts:198](https://github.com/Sitecore/content-sdk/blob/d3af2cd892f68ce06adce0cdd2ad35a56eaf7c9c/packages/core/src/config/models.ts#L198)

Type to be used as cli config input in sitecore.cli.config

## Properties

### build?

> `optional` **build**: `object`

Defined in: [packages/core/src/config/models.ts:202](https://github.com/Sitecore/content-sdk/blob/d3af2cd892f68ce06adce0cdd2ad35a56eaf7c9c/packages/core/src/config/models.ts#L202)

Configuration for the `sitecore-tools build` cli command

#### commands?

> `optional` **commands**: () => `Promise`\<`void`\>[]

List of commands to run during the build process

##### Returns

`Promise`\<`void`\>

***

### scaffold?

> `optional` **scaffold**: `object`

Defined in: [packages/core/src/config/models.ts:211](https://github.com/Sitecore/content-sdk/blob/d3af2cd892f68ce06adce0cdd2ad35a56eaf7c9c/packages/core/src/config/models.ts#L211)

Configuration for the `sitecore-tools scaffold` cli command

#### templates?

> `optional` **templates**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

List of scaffold templates that can be used for generating components
