[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [config](../README.md) / SitecoreConfigInput

# Type Alias: SitecoreConfigInput

> **SitecoreConfigInput** = `object`

Defined in: [packages/core/src/config/models.ts:24](https://github.com/Sitecore/content-sdk/blob/55d6c83fd4a4a491cdcf200f04209ca985791acd/packages/core/src/config/models.ts#L24)

Type to be used as config input in sitecore.config

## Properties

### api?

> `optional` **api**: `object`

Defined in: [packages/core/src/config/models.ts:30](https://github.com/Sitecore/content-sdk/blob/55d6c83fd4a4a491cdcf200f04209ca985791acd/packages/core/src/config/models.ts#L30)

API settings required to connect to Sitecore.
Both edge and local sets can be specified; the Content SDK app will choose
the correct credentials (Edge or local) at runtime.

#### edge?

> `optional` **edge**: `object`

Edge endpoint credentials for connecting to an XM Cloud instance.

##### edge.clientContextId?

> `optional` **clientContextId**: `string`

Optional identifier used to connect and retrieve data from XM Cloud instance in client-side functionality

##### edge.contextId

> **contextId**: `string`

A unified identifier used to connect and retrieve data from XM Cloud instance
Must be provided together with `clientContextId` to support both server-
side and browser-side data fetching.

##### edge.edgeUrl?

> `optional` **edgeUrl**: `string`

XM Cloud endpoint that the app will communicate and retrieve data from

###### Default

```ts
https://edge-platform.sitecorecloud.io
```

#### local?

> `optional` **local**: `object`

API endpoint credentials for connecting to a local Sitecore instance.

##### local.apiHost

> **apiHost**: `string`

Sitecore API hostname that the app connects to

##### local.apiKey

> **apiKey**: `string`

Sitecore API key used to connect to the GraphQL endpoint

##### local.path?

> `optional` **path**: `string`

GraphQL endpoint path (appended to `apiHost` to form the full URL).

###### Default

```ts
/sitecore/api/graph/edge
```

***

### defaultLanguage?

> `optional` **defaultLanguage**: `string`

Defined in: [packages/core/src/config/models.ts:75](https://github.com/Sitecore/content-sdk/blob/55d6c83fd4a4a491cdcf200f04209ca985791acd/packages/core/src/config/models.ts#L75)

The default and fallback locale for your site.
Ensure it aligns with the framework-specific settings used in your application.

***

### defaultSite?

> `optional` **defaultSite**: `string`

Defined in: [packages/core/src/config/models.ts:79](https://github.com/Sitecore/content-sdk/blob/55d6c83fd4a4a491cdcf200f04209ca985791acd/packages/core/src/config/models.ts#L79)

Your default site name. When using the multisite feature this variable defines the fallback site.

***

### dictionary?

> `optional` **dictionary**: `object`

Defined in: [packages/core/src/config/models.ts:121](https://github.com/Sitecore/content-sdk/blob/55d6c83fd4a4a491cdcf200f04209ca985791acd/packages/core/src/config/models.ts#L121)

Settings for Dictionary Service

#### caching?

> `optional` **caching**: `object`

Configure local memory caching for Dictionary Service requests

##### caching.enabled?

> `optional` **enabled**: `boolean`

##### caching.timeout?

> `optional` **timeout**: `number`

***

### disableCodeGeneration?

> `optional` **disableCodeGeneration**: `boolean`

Defined in: [packages/core/src/config/models.ts:210](https://github.com/Sitecore/content-sdk/blob/55d6c83fd4a4a491cdcf200f04209ca985791acd/packages/core/src/config/models.ts#L210)

Opt-out setting for code generation feature
Disables code extraction procedure

***

### editingSecret?

> `optional` **editingSecret**: `string`

Defined in: [packages/core/src/config/models.ts:84](https://github.com/Sitecore/content-sdk/blob/55d6c83fd4a4a491cdcf200f04209ca985791acd/packages/core/src/config/models.ts#L84)

Editing secret required for Sitecore editing and preview functionality.
Default comes from the SITECORE_EDITING_SECRET environment variable.

***

### layout?

> `optional` **layout**: `object`

Defined in: [packages/core/src/config/models.ts:106](https://github.com/Sitecore/content-sdk/blob/55d6c83fd4a4a491cdcf200f04209ca985791acd/packages/core/src/config/models.ts#L106)

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

Defined in: [packages/core/src/config/models.ts:134](https://github.com/Sitecore/content-sdk/blob/55d6c83fd4a4a491cdcf200f04209ca985791acd/packages/core/src/config/models.ts#L134)

Settings for multisite functionality

#### enabled?

> `optional` **enabled**: `boolean`

Enable multisite

**WARNING: Do NOT disable multisite in App Router applications.**

The App Router route structure requires the `[site]` segment in the path (`/[site]/[locale]/[[...path]]`).
Disabling this will break routing and cause 404 errors for regular requests.

Preview and Editing modes will still work (they bypass this check), but regular page requests will fail.

**For single-site setups**: Keep `enabled: true` and configure only one site in your sites configuration.
The middleware will always use that single site, achieving the desired single-site behavior.

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

Defined in: [packages/core/src/config/models.ts:159](https://github.com/Sitecore/content-sdk/blob/55d6c83fd4a4a491cdcf200f04209ca985791acd/packages/core/src/config/models.ts#L159)

Settings for Personalize functionality

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

Currency for CDP requests

##### Default

```ts
'USA'
```

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

Optional Sitecore Personalize scope ID (to isolate data between environments)

***

### redirects?

> `optional` **redirects**: `object`

Defined in: [packages/core/src/config/models.ts:194](https://github.com/Sitecore/content-sdk/blob/55d6c83fd4a4a491cdcf200f04209ca985791acd/packages/core/src/config/models.ts#L194)

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

Defined in: [packages/core/src/config/models.ts:88](https://github.com/Sitecore/content-sdk/blob/55d6c83fd4a4a491cdcf200f04209ca985791acd/packages/core/src/config/models.ts#L88)

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
