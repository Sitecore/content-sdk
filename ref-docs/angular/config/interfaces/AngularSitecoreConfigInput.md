[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [config](../README.md) / AngularSitecoreConfigInput

# Interface: AngularSitecoreConfigInput

Defined in: [packages/angular/src/config/define-config.ts:22](https://github.com/Sitecore/content-sdk/blob/6f8e423028bdf8a74a2fc4b8cb084961d755b73f/packages/angular/src/config/define-config.ts#L22)

Sitecore configuration input for Angular apps. Extends the base
[SitecoreConfigInput](../content/config/type-aliases/SitecoreConfigInput.md) with an `angular` section. `redirects.locales` is intentionally
omitted from the input — it is derived from `angular.locales` so there is a single
source of truth for the locale list.

## Extends

- `Omit`\<[`SitecoreConfigInput`](../content/config/type-aliases/SitecoreConfigInput.md), `"multisite"`\>

## Properties

### angular?

> `optional` **angular?**: `object`

Defined in: [packages/angular/src/config/define-config.ts:24](https://github.com/Sitecore/content-sdk/blob/6f8e423028bdf8a74a2fc4b8cb084961d755b73f/packages/angular/src/config/define-config.ts#L24)

Angular-specific configuration.

#### loadersCache?

> `optional` **loadersCache?**: `object`

Configuration for the ISR-like cache. Both fields default when omitted
(`enabled: true`, `revalidate: 300`).

##### loadersCache.enabled?

> `optional` **enabled?**: `boolean`

Whether the cache is enabled.

##### loadersCache.revalidate?

> `optional` **revalidate?**: `number`

The global revalidate time in seconds.

#### locales?

> `optional` **locales?**: `string`[]

Locales supported by the Angular app.
`defaultLanguage` is prepended automatically when absent.

***

### api?

> `optional` **api?**: `object`

Defined in: packages/content/types/config/models.d.ts:27

API settings required to connect to Sitecore.
Both edge and local sets can be specified; the Content SDK app will choose
the correct credentials (Edge or local) at runtime.

#### edge?

> `optional` **edge?**: `object`

Edge endpoint credentials for connecting to an XM Cloud instance.

##### edge.clientContextId?

> `optional` **clientContextId?**: `string`

Optional identifier used to connect and retrieve data from XM Cloud instance in client-side functionality

##### edge.contextId

> **contextId**: `string`

A unified identifier used to connect and retrieve data from XM Cloud instance
Must be provided together with `clientContextId` to support both server-
side and browser-side data fetching.

##### edge.edgeUrl?

> `optional` **edgeUrl?**: `string`

XM Cloud endpoint that the app will communicate and retrieve data from

###### Default

```ts
https://edge-platform.sitecorecloud.io
```

#### local?

> `optional` **local?**: `object`

API endpoint credentials for connecting to a local Sitecore instance.

##### local.apiHost

> **apiHost**: `string`

Sitecore API hostname that the app connects to

##### local.apiKey

> **apiKey**: `string`

Sitecore API key used to connect to the GraphQL endpoint

##### local.path?

> `optional` **path?**: `string`

GraphQL endpoint path (appended to `apiHost` to form the full URL).

###### Default

```ts
/sitecore/api/graph/edge
```

#### Inherited from

`Omit.api`

***

### defaultLanguage?

> `optional` **defaultLanguage?**: `string`

Defined in: packages/content/types/config/models.d.ts:71

The default and fallback locale for your site.
Ensure it aligns with the framework-specific settings used in your application.

#### Inherited from

`Omit.defaultLanguage`

***

### defaultSite?

> `optional` **defaultSite?**: `string`

Defined in: packages/content/types/config/models.d.ts:75

Your default site name. When using the multisite feature this variable defines the fallback site.

#### Inherited from

`Omit.defaultSite`

***

### dictionary?

> `optional` **dictionary?**: `object`

Defined in: packages/content/types/config/models.d.ts:114

Settings for Dictionary Service

#### caching?

> `optional` **caching?**: `object`

Configure local memory caching for Dictionary Service requests

##### caching.enabled?

> `optional` **enabled?**: `boolean`

##### caching.timeout?

> `optional` **timeout?**: `number`

#### Inherited from

`Omit.dictionary`

***

### disableCodeGeneration?

> `optional` **disableCodeGeneration?**: `boolean`

Defined in: packages/content/types/config/models.d.ts:208

Opt-out setting for code generation feature
Disables code extraction procedure

#### Inherited from

`Omit.disableCodeGeneration`

***

### editingSecret?

> `optional` **editingSecret?**: `string`

Defined in: packages/content/types/config/models.d.ts:80

Editing secret required for Sitecore editing and preview functionality.
Default comes from the SITECORE_EDITING_SECRET environment variable.

#### Inherited from

`Omit.editingSecret`

***

### layout?

> `optional` **layout?**: `object`

Defined in: packages/content/types/config/models.d.ts:100

Settings for Layout Service

#### formatLayoutQuery?

> `optional` **formatLayoutQuery?**: ((`siteName`, `itemPath`, `locale?`) => `string`) \| `null`

Override the first part of graphQL query for Layout Service (excluding the fields part)

##### Param

**siteName**

your site name

##### Param

**itemPath**

full path to Sitecore item/route

##### Param

**locale**

item/route language

##### Returns

custom layout query

##### Default

```ts
'layout(site:"${siteName}", routePath:"${itemPath}", language:"${language}")'
```

#### Inherited from

`Omit.layout`

***

### multisite?

> `optional` **multisite?**: `object`

Defined in: [packages/angular/src/config/define-config.ts:41](https://github.com/Sitecore/content-sdk/blob/6f8e423028bdf8a74a2fc4b8cb084961d755b73f/packages/angular/src/config/define-config.ts#L41)

#### enabled?

> `optional` **enabled?**: `boolean`

#### useCookieResolution?

> `optional` **useCookieResolution?**: (`req?`, `res?`) => `boolean`

Function used to determine if site should be resolved from sc_site cookie when present

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `req?` | [`ExpressRequest`](../../server/middleware/interfaces/ExpressRequest.md) |
| `res?` | [`ExpressResponse`](../../server/middleware/interfaces/ExpressResponse.md) |

##### Returns

`boolean`

***

### personalize?

> `optional` **personalize?**: `object`

Defined in: packages/content/types/config/models.d.ts:150

Settings for Personalize functionality

#### cdpTimeout?

> `optional` **cdpTimeout?**: `number`

Configuration for your Sitecore CDP endpoint
by default set by the PERSONALIZE_MIDDLEWARE_CDP_TIMEOUT environment variable (for personalize proxy)
if not set, will use the default value of 400ms

#### channel?

> `optional` **channel?**: `string`

The Sitecore CDP channel to use for events. Uses 'WEB' by default.

#### currency?

> `optional` **currency?**: `string`

Currency for CDP requests

##### Default

```ts
'USA'
```

#### edgeTimeout?

> `optional` **edgeTimeout?**: `number`

Configuration for your Sitecore Experience Edge endpoint
by default set by the PERSONALIZE_MIDDLEWARE_EDGE_TIMEOUT environment variable (for personalize proxy)
if not set, will use the default value of 400ms

#### enabled?

> `optional` **enabled?**: `boolean`

Enable personalize proxy

##### Default

```ts
process.env.NODE_ENV !== 'development'
```

#### scope?

> `optional` **scope?**: `string`

Optional Sitecore Personalize scope ID (to isolate data between environments)

#### Inherited from

`Omit.personalize`

***

### redirects?

> `optional` **redirects?**: `object`

Defined in: packages/content/types/config/models.d.ts:185

Settings for redirects functionality

#### enabled?

> `optional` **enabled?**: `boolean`

Enable redirects middleware

##### Default

```ts
process.env.NODE_ENV !== 'development'
```

#### locales?

> `optional` **locales?**: `string`[]

These are all the locales you support in your application.
These should match those in framework-specific configuration of your app.

#### Inherited from

`Omit.redirects`

***

### retries?

> `optional` **retries?**: `object`

Defined in: packages/content/types/config/models.d.ts:84

Retry configuration applied to Layout, Dictionary and ErrorPages services

#### count?

> `optional` **count?**: `number`

Number of retries for the GraphQL client.

##### Default

```ts
3
```

#### retryStrategy?

> `optional` **retryStrategy?**: `RetryStrategy`

Retry strategy for the client. By default, uses exponential
back-off factor of 2 for codes 429, 502, 503, 504, 520, 521, 522, 523, 524.

##### Default

```ts
DefaultRetryStrategy
```

#### Inherited from

`Omit.retries`

***

### rewriteMediaUrls?

> `optional` **rewriteMediaUrls?**: `boolean` \| ((`value`) => `string`)

Defined in: packages/content/types/config/models.d.ts:203

Rewrite media/content URLs in layout (media fields, rich text img/src, href, etc.).
- When `true`: use default rewriter (Edge hostnames -> custom hostname from env).
- When a function: transform each string value; the SDK traverses the layout for you.

#### Default

```ts
false
```

#### Inherited from

`Omit.rewriteMediaUrls`
