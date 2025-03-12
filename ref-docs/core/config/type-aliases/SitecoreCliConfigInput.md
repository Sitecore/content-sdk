[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput**: `object`

Defined in: [packages/core/src/config/models.ts:190](https://github.com/Sitecore/xmc-jss-dev/blob/692b154f482187bff433276bee9671bda23cfd11/packages/core/src/config/models.ts#L190)

Type to be used as cli config input in sitecore.cli.config

## Type declaration

### build?

> `optional` **build**: `object`

Configuration for the `scs build` cli command

#### build.commands?

> `optional` **commands**: () => `Promise`\<`void`\>[]

List of commands to run during the build process

##### Returns

`Promise`\<`void`\>

### scaffold?

> `optional` **scaffold**: `object`

Configuration for the `scs scaffold` cli command

#### scaffold.templates?

> `optional` **templates**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

List of scaffold templates that can be used for generating components
