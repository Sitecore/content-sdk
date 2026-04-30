[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / ErrorPagesServiceConfig

# Interface: ErrorPagesServiceConfig

Defined in: [content/src/site/error-pages-service.ts:33](https://github.com/Sitecore/content-sdk/blob/b76e6169344e65141a96238321b74ef92202b436/packages/content/src/site/error-pages-service.ts#L33)

Configuration for

## See

ErrorPagesService instances

## Extends

- `GraphQLServiceConfig`

## Properties

### clientFactory

> **clientFactory**: [`GraphQLRequestClientFactory`](../../client/type-aliases/GraphQLRequestClientFactory.md)

Defined in: [content/src/site/error-pages-service.ts:42](https://github.com/Sitecore/content-sdk/blob/b76e6169344e65141a96238321b74ef92202b436/packages/content/src/site/error-pages-service.ts#L42)

A GraphQL Request Client Factory is a function that accepts configuration and returns an instance of a GraphQLRequestClient.
This factory function is used to create and configure GraphQL clients for making GraphQL API requests.

#### Overrides

`GraphQLServiceConfig.clientFactory`

***

### debugger?

> `optional` **debugger**: `Debugger`

Defined in: [content/src/sitecore-service-base.ts:13](https://github.com/Sitecore/content-sdk/blob/b76e6169344e65141a96238321b74ef92202b436/packages/content/src/sitecore-service-base.ts#L13)

Optional debug logger override

#### Inherited from

`GraphQLServiceConfig.debugger`

***

### language

> **language**: `string`

Defined in: [content/src/site/error-pages-service.ts:37](https://github.com/Sitecore/content-sdk/blob/b76e6169344e65141a96238321b74ef92202b436/packages/content/src/site/error-pages-service.ts#L37)

The language

***

### retries?

> `optional` **retries**: `object`

Defined in: [content/src/config/models.ts:88](https://github.com/Sitecore/content-sdk/blob/b76e6169344e65141a96238321b74ef92202b436/packages/content/src/config/models.ts#L88)

Retry configuration applied to Layout, Dictionary and ErrorPages services

#### count?

> `optional` **count**: `number`

Number of retries for the GraphQL client.

##### Default

```ts
3
```

#### retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../../client/interfaces/RetryStrategy.md)

Retry strategy for the client. By default, uses exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

##### Default

```ts
DefaultRetryStrategy
```

#### Inherited from

`GraphQLServiceConfig.retries`
