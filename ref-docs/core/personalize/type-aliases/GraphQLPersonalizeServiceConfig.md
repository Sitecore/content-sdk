[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [personalize](../README.md) / GraphQLPersonalizeServiceConfig

# Type Alias: GraphQLPersonalizeServiceConfig

> **GraphQLPersonalizeServiceConfig**: [`CacheOptions`](../../index/interfaces/CacheOptions.md) & `object`

Defined in: [packages/core/src/personalize/graphql-personalize-service.ts:6](https://github.com/Sitecore/content-sdk/blob/05a4e1364ff83949860742eef6624dc0ba9e2c01/packages/core/src/personalize/graphql-personalize-service.ts#L6)

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
