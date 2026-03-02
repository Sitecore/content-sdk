[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [site](../README.md) / RobotsService

# Class: RobotsService

Defined in: [content/src/site/robots-service.ts:43](https://github.com/Sitecore/content-sdk/blob/cfea6f37e3bdfe18c9aded77b244ce21391adbfd/packages/content/src/site/robots-service.ts#L43)

Service that fetch the robots.txt data using Sitecore's GraphQL API.

## Constructors

### Constructor

> **new RobotsService**(`options`): `RobotsService`

Defined in: [content/src/site/robots-service.ts:50](https://github.com/Sitecore/content-sdk/blob/cfea6f37e3bdfe18c9aded77b244ce21391adbfd/packages/content/src/site/robots-service.ts#L50)

Creates an instance of graphQL robots.txt service with the provided options

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | [`RobotsServiceConfig`](../type-aliases/RobotsServiceConfig.md) | instance |

#### Returns

`RobotsService`

## Properties

### options

> **options**: [`RobotsServiceConfig`](../type-aliases/RobotsServiceConfig.md)

Defined in: [content/src/site/robots-service.ts:50](https://github.com/Sitecore/content-sdk/blob/cfea6f37e3bdfe18c9aded77b244ce21391adbfd/packages/content/src/site/robots-service.ts#L50)

instance

## Accessors

### query

#### Get Signature

> **get** `protected` **query**(): `string`

Defined in: [content/src/site/robots-service.ts:54](https://github.com/Sitecore/content-sdk/blob/cfea6f37e3bdfe18c9aded77b244ce21391adbfd/packages/content/src/site/robots-service.ts#L54)

##### Returns

`string`

## Methods

### fetchRobots()

> **fetchRobots**(`fetchOptions?`): `Promise`\<`string`\>

Defined in: [content/src/site/robots-service.ts:64](https://github.com/Sitecore/content-sdk/blob/cfea6f37e3bdfe18c9aded77b244ce21391adbfd/packages/content/src/site/robots-service.ts#L64)

Fetch a data of robots.txt from API

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `fetchOptions?` | [`FetchOptions`](../../client/type-aliases/FetchOptions.md) | The fetch options to be used for the request. |

#### Returns

`Promise`\<`string`\>

text of robots.txt

#### Throws

if the siteName is empty.

***

### getGraphQLClient()

> `protected` **getGraphQLClient**(): [`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

Defined in: [content/src/site/robots-service.ts:93](https://github.com/Sitecore/content-sdk/blob/cfea6f37e3bdfe18c9aded77b244ce21391adbfd/packages/content/src/site/robots-service.ts#L93)

Gets a GraphQL client that can make requests to the API. Uses graphql-request as the default
library for fetching graphql data (@see GraphQLRequestClient). Override this method if you
want to use something else.

#### Returns

[`GraphQLClient`](../../client/interfaces/GraphQLClient.md)

implementation
