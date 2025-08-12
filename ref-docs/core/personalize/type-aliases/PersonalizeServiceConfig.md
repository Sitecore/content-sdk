[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [personalize](../README.md) / PersonalizeServiceConfig

# Type Alias: PersonalizeServiceConfig

> **PersonalizeServiceConfig** = [`CacheOptions`](../../index/interfaces/CacheOptions.md) & `object`

Defined in: [packages/core/src/personalize/personalize-service.ts:6](https://github.com/Sitecore/content-sdk/blob/17b78a735074f73c0cdc6532a1d6a2c33949de59/packages/core/src/personalize/personalize-service.ts#L6)

## Type declaration

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

### fetch?

> `optional` **fetch**: *typeof* `fetch`

Override fetch method. Uses 'GraphQLRequestClient' default otherwise.

### ~~scope?~~

> `optional` **scope**: `string`

Optional Sitecore Personalize scope identifier allowing you to isolate your personalization data between XM Cloud environments

#### Deprecated

Will be removed in a future release.

### timeout?

> `optional` **timeout**: `number`

Timeout (ms) for the Personalize request. Default is 400.
