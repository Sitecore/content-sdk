[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreConfigInput

# Type Alias: SitecoreConfigInput

> **SitecoreConfigInput**: `object`

Defined in: [packages/core/src/config/models.ts:15](https://github.com/Sitecore/content-sdk/blob/0368ee89b256e5717d28a2086597ae659abd51a0/packages/core/src/config/models.ts#L15)

Type to be used as config input in sitecore.config

## Type declaration

### api

> **api**: `object`

API settings required to connect to Sitecore.
Both edge and local set can be specified as JSS app will use API Key for component library

#### api.edge?

> `optional` **edge**: `object`

Edge endpoint credentials for Sitecore connection. Will be used to connect to SaaS XMCloud instance

#### api.edge.clientContextId?

> `optional` **clientContextId**: `string`

Optional identifier used to connect and retrieve data from XM Cloud instance in client-side functionality

#### api.edge.contextId

> **contextId**: `string`

A unified identifier used to connect and retrieve data from XM Cloud instance

#### api.edge.edgeUrl?

> `optional` **edgeUrl**: `string`

XM Cloud endpoint that the app will communicate and retrieve data from

##### Default

```ts
https://edge-platform.sitecorecloud.io
```

#### api.local?

> `optional` **local**: `object`

API endpoint credentials for connection to local Sitecore instance

#### api.local.apiHost

> **apiHost**: `string`

Sitecore API hostname that the app will connect and retrieve data from

#### api.local.apiKey

> **apiKey**: `string`

Sitecore API key identifier used to connect to the GraphQL endpoint

#### api.local.path?

> `optional` **path**: `string`

GraphQL endpoint path, will be appended to apiHost to form full enpoint URL ($apiHost/$path)

##### Default

```ts
/sitecore/api/graph/edge
```

### defaultLanguage

> **defaultLanguage**: `string`

The default and fallback locale for your site.
Ensure it aligns with the framework-specific settings used in your application.

### defaultSite?

> `optional` **defaultSite**: `string`

Your default site name. When using the multisite feature this variable defines the fallback site.

#### Default

```ts
empty string
```

### dictionary?

> `optional` **dictionary**: `object`

Settings for Dictionary Service

#### dictionary.caching?

> `optional` **caching**: `object`

configure local memory caching for Dictionary Service requests

#### dictionary.caching.enabled?

> `optional` **enabled**: `boolean`

#### dictionary.caching.timeout?

> `optional` **timeout**: `number`

### editingSecret?

> `optional` **editingSecret**: `string`

Editing secret required to support Sitecore editing and preview functionality.

### layout?

> `optional` **layout**: `object`

Settings for Layout Service

#### layout.formatLayoutQuery?

> `optional` **formatLayoutQuery**: (`siteName`, `itemPath`, `locale`?) => `string` \| `null`

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

### multisite?

> `optional` **multisite**: `object`

Settings for multisite functionaliry

#### multisite.defaultHostname?

> `optional` **defaultHostname**: `string`

Fallback hostname in case `host` header is not present

##### Default

```ts
localhost
```

#### multisite.enabled?

> `optional` **enabled**: `boolean`

Enable multisite

##### Default

```ts
true
```

#### multisite.useCookieResolution()?

> `optional` **useCookieResolution**: (`req`?, `res`?) => `boolean`

Function used to determine if site should be resolved from sc_site cookie when present

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req`? | `RequestInit` |
| `res`? | `ResponseInit` |

##### Returns

`boolean`

### personalize?

> `optional` **personalize**: `object`

Setting for personalize functionality

#### personalize.cdpTimeout?

> `optional` **cdpTimeout**: `number`

Configuration for your Sitecore CDP endpoint

#### personalize.channel?

> `optional` **channel**: `string`

The Sitecore CDP channel to use for events. Uses 'WEB' by default.

#### personalize.currency?

> `optional` **currency**: `string`

Currency for CDP request. Uses 'USA' as default.

#### personalize.edgeTimeout?

> `optional` **edgeTimeout**: `number`

Configuration for your Sitecore Experience Edge endpoint

#### personalize.enabled?

> `optional` **enabled**: `boolean`

Enable personalize middleware

##### Default

```ts
process.env.NODE_ENV !== 'development'
```

#### personalize.scope?

> `optional` **scope**: `string`

Optional Sitecore Personalize scope identifier allowing you to isolate your personalization data between XM Cloud environments

### redirects?

> `optional` **redirects**: `object`

Settings for redirects functionality

#### redirects.enabled?

> `optional` **enabled**: `boolean`

Enable redirects middleware

##### Default

```ts
process.env.NODE_ENV !== 'development'
```

#### redirects.locales?

> `optional` **locales**: `string`[]

These are all the locales you support in your application.
These should match those in framework-specific configuration of your app.

### retries?

> `optional` **retries**: `object`

Retry configuration applied to Layout, Dictionary and ErrorPages services out of the box

#### retries.count?

> `optional` **count**: `number`

Number of retries for graphql client. Will use the specified `retryStrategy`.

##### Default

```ts
3
```

#### retries.retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md)

Retry strategy for the client. By default, uses exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

##### Default

```ts
DefaultRetryStrategy
```
