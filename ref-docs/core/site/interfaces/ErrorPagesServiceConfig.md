[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [site](../README.md) / ErrorPagesServiceConfig

# Interface: ErrorPagesServiceConfig

Defined in: [packages/core/src/site/error-pages-service.ts:28](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/core/src/site/error-pages-service.ts#L28)

## Extends

- `GraphQLServiceConfig`

## Properties

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../index/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [packages/core/src/site/error-pages-service.ts:37](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/core/src/site/error-pages-service.ts#L37)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

#### Overrides

`GraphQLServiceConfig.clientFactory`

***

### debugger?

> `optional` **debugger**: `Debugger`

Defined in: [packages/core/src/sitecore-service-base.ts:14](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/core/src/sitecore-service-base.ts#L14)

Optional debug logger override

#### Inherited from

`GraphQLServiceConfig.debugger`

***

### language

> **language**: `string`

Defined in: [packages/core/src/site/error-pages-service.ts:32](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/core/src/site/error-pages-service.ts#L32)

The language

***

### retries?

> `optional` **retries**: `object`

Defined in: [packages/core/src/config/models.ts:87](https://github.com/Sitecore/content-sdk/blob/3164917a53e03fa6723785be29b411031326a877/packages/core/src/config/models.ts#L87)

Retry configuration applied to Layout, Dictionary and ErrorPages services

#### count?

> `optional` **count**: `number`

Number of retries for the GraphQL client.

##### Default

```ts
3
```

#### retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md)

Retry strategy for the client. By default, uses exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

##### Default

```ts
DefaultRetryStrategy
```

#### Inherited from

`GraphQLServiceConfig.retries`
