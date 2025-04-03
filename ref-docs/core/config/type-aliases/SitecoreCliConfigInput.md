[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreCliConfigInput

# Type Alias: SitecoreCliConfigInput

> **SitecoreCliConfigInput**: `object`

Defined in: [packages/core/src/config/models.ts:186](https://github.com/Sitecore/content-sdk/blob/8b95896c4f9d2f6a2c452ee63406a9f69e9ab407/packages/core/src/config/models.ts#L186)

Type to be used as cli config input in sitecore.cli.config

## Type declaration

### build?

> `optional` **build**: `object`

Configuration for the `sitecore-tools build` cli command

#### build.commands?

> `optional` **commands**: () => `Promise`\<`void`\>[]

List of commands to run during the build process

##### Returns

`Promise`\<`void`\>

### scaffold?

> `optional` **scaffold**: `object`

Configuration for the `sitecore-tools scaffold` cli command

#### scaffold.templates?

> `optional` **templates**: [`ScaffoldTemplate`](ScaffoldTemplate.md)[]

List of scaffold templates that can be used for generating components
