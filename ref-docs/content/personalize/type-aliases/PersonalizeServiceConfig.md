[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [personalize](../README.md) / PersonalizeServiceConfig

# Type Alias: PersonalizeServiceConfig

> **PersonalizeServiceConfig** = `CacheOptions` & `object`

Defined in: [content/src/personalize/personalize-service.ts:15](https://github.com/Sitecore/content-sdk/blob/500ff39a667bc697e65ad8db118ac8c76a24bf2b/packages/content/src/personalize/personalize-service.ts#L15)

Configuration for the PersonalizeService.

## Type Declaration

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

### fetch?

> `optional` **fetch**: *typeof* `fetch`

Override fetch method. Uses 'GraphQLRequestClient' default otherwise.

### scope?

> `optional` **scope**: `string`

Optional Sitecore Personalize scope identifier allowing you to isolate your personalization data between XM Cloud environments

### timeout?

> `optional` **timeout**: `number`

Timeout (ms) for the Personalize request. Default is 400.
