[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput** = `object`

Defined in: [packages/core/src/config/models.ts:191](https://github.com/Sitecore/content-sdk/blob/b35860e173c4258c981f546aecdc086cd4c5f56d/packages/core/src/config/models.ts#L191)

Type to be used as cli config input in sitecore.cli.config

## Properties

### build?

> `optional` **build**: `object`

Defined in: [packages/core/src/config/models.ts:195](https://github.com/Sitecore/content-sdk/blob/b35860e173c4258c981f546aecdc086cd4c5f56d/packages/core/src/config/models.ts#L195)

Configuration for the `sitecore-tools build` cli command

#### commands?

> `optional` **commands**: () => `Promise`\<`void`\>[]

List of commands to run during the build process

##### Returns

`Promise`\<`void`\>

***

### scaffold?

> `optional` **scaffold**: `object`

Defined in: [packages/core/src/config/models.ts:204](https://github.com/Sitecore/content-sdk/blob/b35860e173c4258c981f546aecdc086cd4c5f56d/packages/core/src/config/models.ts#L204)

Configuration for the `sitecore-tools scaffold` cli command

#### templates?

> `optional` **templates**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

List of scaffold templates that can be used for generating components
