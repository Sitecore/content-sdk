[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreConfigInput

# Type Alias: SitecoreConfigInput

> **SitecoreConfigInput** = `object`

Defined in: [packages/core/src/config/models.ts:23](https://github.com/Sitecore/content-sdk/blob/b08c7a5b2b75c0c3ba34a346731d8dd1adfa18dc/packages/core/src/config/models.ts#L23)

Type to be used as config input in sitecore.config

## Properties

### api?

> `optional` **api**: `object`

Defined in: [packages/core/src/config/models.ts:28](https://github.com/Sitecore/content-sdk/blob/b08c7a5b2b75c0c3ba34a346731d8dd1adfa18dc/packages/core/src/config/models.ts#L28)

API settings required to connect to Sitecore.
Both edge and local set can be specified as JSS app will use API Key for component library

#### edge?

> `optional` **edge**: `object`

Edge endpoint credentials for Sitecore connection. Will be used to connect to SaaS XMCloud instance

##### edge.clientContextId?

> `optional` **clientContextId**: `string`

Optional identifier used to connect and retrieve data from XM Cloud instance in client-side functionality

##### edge.contextId

> **contextId**: `string`

A unified identifier used to connect and retrieve data from XM Cloud instance

##### edge.edgeUrl?

> `optional` **edgeUrl**: `string`

XM Cloud endpoint that the app will communicate and retrieve data from

###### Default

```ts
https://edge-platform.sitecorecloud.io
```

#### local?

> `optional` **local**: `object`

API endpoint credentials for connection to local Sitecore instance

##### local.apiHost

> **apiHost**: `string`

Sitecore API hostname that the app will connect and retrieve data from

##### local.apiKey

> **apiKey**: `string`

Sitecore API key identifier used to connect to the GraphQL endpoint

##### local.path?

> `optional` **path**: `string`

GraphQL endpoint path, will be appended to apiHost to form full enpoint URL ($apiHost/$path)

###### Default

```ts
/sitecore/api/graph/edge
```

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [packages/core/src/config/models.ts:72](https://github.com/Sitecore/content-sdk/blob/b08c7a5b2b75c0c3ba34a346731d8dd1adfa18dc/packages/core/src/config/models.ts#L72)

The default and fallback locale for your site.
Ensure it aligns with the framework-specific settings used in your application.

***

### defaultSite?

> `optional` **defaultSite**: `string`

Defined in: [packages/core/src/config/models.ts:77](https://github.com/Sitecore/content-sdk/blob/b08c7a5b2b75c0c3ba34a346731d8dd1adfa18dc/packages/core/src/config/models.ts#L77)

Your default site name. When using the multisite feature this variable defines the fallback site.

#### Default

```ts
empty string
```

***

### dictionary?

> `optional` **dictionary**: `object`

Defined in: [packages/core/src/config/models.ts:116](https://github.com/Sitecore/content-sdk/blob/b08c7a5b2b75c0c3ba34a346731d8dd1adfa18dc/packages/core/src/config/models.ts#L116)

Settings for Dictionary Service

#### caching?

> `optional` **caching**: `object`

configure local memory caching for Dictionary Service requests

##### caching.enabled?

> `optional` **enabled**: `boolean`

##### caching.timeout?

> `optional` **timeout**: `number`

***

### editingSecret?

> `optional` **editingSecret**: `string`

Defined in: [packages/core/src/config/models.ts:82](https://github.com/Sitecore/content-sdk/blob/b08c7a5b2b75c0c3ba34a346731d8dd1adfa18dc/packages/core/src/config/models.ts#L82)

Editing secret required to support Sitecore editing and preview functionality.
by default set by the JSS_EDITING_SECRET environment variable

***

### layout?

> `optional` **layout**: `object`

Defined in: [packages/core/src/config/models.ts:102](https://github.com/Sitecore/content-sdk/blob/b08c7a5b2b75c0c3ba34a346731d8dd1adfa18dc/packages/core/src/config/models.ts#L102)

Settings for Layout Service

#### formatLayoutQuery?

> `optional` **formatLayoutQuery**: (`siteName`, `itemPath`, `locale?`) => `string` \| `null`

Override the first part of graphQL query for Layout Service (excluding the fields part)

##### Param

your site name

##### Param

full path to Sitecore item/route

##### Param

item/route language

##### Returns

custom layout query

##### Default

```ts
'layout(site:"${siteName}", routePath:"${itemPath}", language:"${language}")'
```

***

### multisite?

> `optional` **multisite**: `object`

Defined in: [packages/core/src/config/models.ts:128](https://github.com/Sitecore/content-sdk/blob/b08c7a5b2b75c0c3ba34a346731d8dd1adfa18dc/packages/core/src/config/models.ts#L128)

Settings for multisite functionaliry

#### enabled?

> `optional` **enabled**: `boolean`

Enable multisite

##### Default

```ts
true
```

#### useCookieResolution()?

> `optional` **useCookieResolution**: (`req?`, `res?`) => `boolean`

Function used to determine if site should be resolved from sc_site cookie when present

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req?` | `RequestInit` |
| `res?` | `ResponseInit` |

##### Returns

`boolean`

***

### personalize?

> `optional` **personalize**: `object`

Defined in: [packages/core/src/config/models.ts:142](https://github.com/Sitecore/content-sdk/blob/b08c7a5b2b75c0c3ba34a346731d8dd1adfa18dc/packages/core/src/config/models.ts#L142)

Setting for personalize functionality

#### cdpTimeout?

> `optional` **cdpTimeout**: `number`

Configuration for your Sitecore CDP endpoint
by default set by the PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT environment variable
if not set, will use the default value of 400ms

#### channel?

> `optional` **channel**: `string`

The Sitecore CDP channel to use for events. Uses 'WEB' by default.

#### currency?

> `optional` **currency**: `string`

Currency for CDP request. Uses 'USA' as default.

#### edgeTimeout?

> `optional` **edgeTimeout**: `number`

Configuration for your Sitecore Experience Edge endpoint
by default set by the PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT environment variable
if not set, will use the default value of 400ms

#### enabled?

> `optional` **enabled**: `boolean`

Enable personalize middleware

##### Default

```ts
process.env.NODE_ENV !== 'development'
```

#### scope?

> `optional` **scope**: `string`

Optional Sitecore Personalize scope identifier allowing you to isolate your personalization data between XM Cloud environments

***

### redirects?

> `optional` **redirects**: `object`

Defined in: [packages/core/src/config/models.ts:176](https://github.com/Sitecore/content-sdk/blob/b08c7a5b2b75c0c3ba34a346731d8dd1adfa18dc/packages/core/src/config/models.ts#L176)

Settings for redirects functionality

#### enabled?

> `optional` **enabled**: `boolean`

Enable redirects middleware

##### Default

```ts
process.env.NODE_ENV !== 'development'
```

#### locales?

> `optional` **locales**: `string`[]

These are all the locales you support in your application.
These should match those in framework-specific configuration of your app.

***

### retries?

> `optional` **retries**: `object`

Defined in: [packages/core/src/config/models.ts:86](https://github.com/Sitecore/content-sdk/blob/b08c7a5b2b75c0c3ba34a346731d8dd1adfa18dc/packages/core/src/config/models.ts#L86)

Retry configuration applied to Layout, Dictionary and ErrorPages services out of the box

#### count?

> `optional` **count**: `number`

Number of retries for graphql client. Will use the specified `retryStrategy`.

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
