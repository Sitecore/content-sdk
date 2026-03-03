[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / ErrorPagesService

# Class: ErrorPagesService

Defined in: content/types/site/error-pages-service.d.ts:46

Service that fetch the error pages data using Sitecore's GraphQL API.

## Constructors

### Constructor

> **new ErrorPagesService**(`options`): `ErrorPagesService`

Defined in: content/types/site/error-pages-service.d.ts:53

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

Defined in: content/types/site/error-pages-service.d.ts:47

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: content/types/site/error-pages-service.d.ts:54

##### Returns

`string`

## Methods

### fetchErrorPages()

> **fetchErrorPages**(`siteName`, `locale?`, `fetchOptions?`): `Promise`\<[`ErrorPages`](../type-aliases/ErrorPages.md) \| `null`\>

Defined in: content/types/site/error-pages-service.d.ts:63

Fetch list of error pages for the site

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `siteName` | `string` | The site name |
| `locale?` | `string` | The language |
| `fetchOptions?` | `FetchOptions` | Options to override graphQL client details like retries and fetch implementation |

#### Returns

`Promise`\<[`ErrorPages`](../type-aliases/ErrorPages.md) \| `null`\>

list of url's error pages

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): `GraphQLClient`

Defined in: content/types/site/error-pages-service.d.ts:70

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

`GraphQLClient`

implementation
