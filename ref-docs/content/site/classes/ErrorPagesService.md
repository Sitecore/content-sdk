[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / ErrorPagesService

# Class: ErrorPagesService

Defined in: [content/src/site/error-pages-service.ts:75](https://github.com/Sitecore/content-sdk/blob/386c7f8bd3745fb4187e490efe4dd14be4a48189/packages/content/src/site/error-pages-service.ts#L75)

Service that fetch the error pages data using Sitecore's GraphQL API.

## Constructors

### Constructor

> **new ErrorPagesService**(`options`): `ErrorPagesService`

Defined in: [content/src/site/error-pages-service.ts:82](https://github.com/Sitecore/content-sdk/blob/386c7f8bd3745fb4187e490efe4dd14be4a48189/packages/content/src/site/error-pages-service.ts#L82)

Creates an instance of graphQL error pages service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`ErrorPagesServiceConfig`](../interfaces/ErrorPagesServiceConfig.md) | instance |

#### Returns

`ErrorPagesService`

## Properties

### options

> **options**: [`ErrorPagesServiceConfig`](../interfaces/ErrorPagesServiceConfig.md)

Defined in: [content/src/site/error-pages-service.ts:82](https://github.com/Sitecore/content-sdk/blob/386c7f8bd3745fb4187e490efe4dd14be4a48189/packages/content/src/site/error-pages-service.ts#L82)

instance

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [content/src/site/error-pages-service.ts:86](https://github.com/Sitecore/content-sdk/blob/386c7f8bd3745fb4187e490efe4dd14be4a48189/packages/content/src/site/error-pages-service.ts#L86)

##### Returns

`string`

## Methods

### fetchErrorPages()

> **fetchErrorPages**(`siteName`, `locale?`, `fetchOptions?`): `Promise`\<[`ErrorPages`](../type-aliases/ErrorPages.md) \| `null`\>

Defined in: [content/src/site/error-pages-service.ts:98](https://github.com/Sitecore/content-sdk/blob/386c7f8bd3745fb4187e490efe4dd14be4a48189/packages/content/src/site/error-pages-service.ts#L98)

Fetch list of error pages for the site

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | The site name |
| `locale?` | `string` | The language |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`ErrorPages`](../type-aliases/ErrorPages.md) \| `null`\>

list of url's error pages

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/site/error-pages-service.ts:143](https://github.com/Sitecore/content-sdk/blob/386c7f8bd3745fb4187e490efe4dd14be4a48189/packages/content/src/site/error-pages-service.ts#L143)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation
