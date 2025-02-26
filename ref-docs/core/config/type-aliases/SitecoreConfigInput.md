[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreConfigInput

# Type Alias: SitecoreConfigInput

> **SitecoreConfigInput**: `object`

Defined in: [packages/core/src/config/models.ts:15](https://github.com/Sitecore/xmc-jss-dev/blob/88c5c2640d5ef72e74febf33dccec61ab7a6e74d/packages/core/src/config/models.ts#L15)

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

#### api.edge.contextId?

> `optional` **contextId**: `string`

#### api.edge.edgeUrl?

> `optional` **edgeUrl**: `string`

#### api.local?

> `optional` **local**: `object`

API endpoint credentials for connection to local Sitecore instance

#### api.local.apiHost?

> `optional` **apiHost**: `string`

#### api.local.apiKey?

> `optional` **apiKey**: `string`

#### api.local.path?

> `optional` **path**: `string`

### defaultLanguage

> **defaultLanguage**: `string`

### defaultSite?

> `optional` **defaultSite**: `string`

### dictionary?

> `optional` **dictionary**: `object`

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

#### layout.formatLayoutQuery?

> `optional` **formatLayoutQuery**: (`siteName`, `itemPath`, `locale`?) => `string` \| `null`

Override default layout query for Layout Service

##### Param

##### Param

##### Param

##### Returns

custom layout query
Layout query
layout(site:"${siteName}", routePath:"${itemPath}", language:"${language}")

### multisite

> **multisite**: `object`

#### multisite.defaultHostname?

> `optional` **defaultHostname**: `string`

Fallback hostname in case `host` header is not present

##### Default

```ts
localhost
```

#### multisite.enabled?

> `optional` **enabled**: `boolean`

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

### personalize

> **personalize**: `object`

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

#### personalize.scope

> **scope**: `string` \| `undefined`

Optional Sitecore Personalize scope identifier allowing you to isolate your personalization data between XM Cloud environments

### redirects

> **redirects**: `object`

#### redirects.enabled?

> `optional` **enabled**: `boolean`

#### redirects.locales?

> `optional` **locales**: `string`[]

These are all the locales you support in your application.
These should match those in your next.config.js (i18n.locales).

### retries?

> `optional` **retries**: `object`

#### retries.count?

> `optional` **count**: `number`

Number of retries for graphql client. Will use the specified `retryStrategy`.

#### retries.retryStrategy?

> `optional` **retryStrategy**: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md)

Retry strategy for the client. Uses `DefaultRetryStrategy` by default with exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.
