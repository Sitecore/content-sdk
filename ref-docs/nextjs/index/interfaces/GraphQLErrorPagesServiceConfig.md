[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / GraphQLErrorPagesServiceConfig

# Interface: GraphQLErrorPagesServiceConfig

Defined in: core/types/site/graphql-error-pages-service.d.ts:5

## Extends

- `GraphQLServiceConfig`

## Properties

### clientFactory

> **clientFactory**: `GraphQLRequestClientFactory`

Defined in: core/types/site/graphql-error-pages-service.d.ts:14

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

#### Overrides

`GraphQLServiceConfig.clientFactory`

***

### debugger?

> `optional` **debugger**: `Debugger`

Defined in: core/types/sitecore-service-base.d.ts:12

Optional debug logger override

#### Inherited from

`GraphQLServiceConfig.debugger`

***

### language

> **language**: `string`

Defined in: core/types/site/graphql-error-pages-service.d.ts:9

The language

***

### retries?

> `optional` **retries**: `object`

Defined in: core/types/config/models.d.ts:70

Retry configuration applied to Layout, Dictionary and ErrorPages services out of the box

#### count?

> `optional` **count**: `number`

Number of retries for graphql client. Will use the specified `retryStrategy`.

##### Default

```ts
3
```

#### retryStrategy?

> `optional` **retryStrategy**: `RetryStrategy`

Retry strategy for the client. By default, uses exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

##### Default

```ts
DefaultRetryStrategy
```

#### Inherited from

`GraphQLServiceConfig.retries`
