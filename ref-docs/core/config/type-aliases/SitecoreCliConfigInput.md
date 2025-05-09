[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

Defined in: [packages/core/src/config/models.ts:186](https://github.com/Sitecore/content-sdk/blob/c289d37ee6e0b2977eac77610a76c55b74b88d57/packages/core/src/config/models.ts#L186)

Type to be used as cli config input in sitecore.cli.config

## Properties

### build?

> `optional` **build**: `object`

Defined in: [packages/core/src/config/models.ts:190](https://github.com/Sitecore/content-sdk/blob/c289d37ee6e0b2977eac77610a76c55b74b88d57/packages/core/src/config/models.ts#L190)

Configuration for the `sitecore-tools build` cli command

#### commands?

> `optional` **commands**: () => `Promise`\<`void`\>[]

List of commands to run during the build process

##### Returns

`Promise`\<`void`\>

***

### scaffold?

> `optional` **scaffold**: `object`

Defined in: [packages/core/src/config/models.ts:199](https://github.com/Sitecore/content-sdk/blob/c289d37ee6e0b2977eac77610a76c55b74b88d57/packages/core/src/config/models.ts#L199)

Configuration for the `sitecore-tools scaffold` cli command

#### templates?

> `optional` **templates**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

List of scaffold templates that can be used for generating components
