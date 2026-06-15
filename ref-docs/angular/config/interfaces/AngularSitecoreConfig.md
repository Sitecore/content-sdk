[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [config](../README.md) / AngularSitecoreConfig

# Interface: AngularSitecoreConfig

Defined in: [packages/angular/src/config/define-config.ts:55](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/config/define-config.ts#L55)

Resolved Sitecore configuration for Angular apps. Extends the fully-resolved
[SitecoreConfig](../content/config/type-aliases/SitecoreConfig.md); structurally still a `SitecoreConfig`, so existing callers that
type the value as `SitecoreConfig` continue to work. `redirects.locales` is intentionally
omitted at the type level — read the canonical locale list from `angular.locales`.

## Extends

- `Omit`\<[`SitecoreConfig`](../content/config/type-aliases/SitecoreConfig.md), `"redirects"`\>

## Properties

### angular

> **angular**: `object`

Defined in: [packages/angular/src/config/define-config.ts:57](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/config/define-config.ts#L57)

#### loadersCache

> **loadersCache**: `object`

Resolved configuration for the ISR-like cache. Defaults are applied by
`defineConfig`: `enabled: true`, `revalidate: 300`.

##### loadersCache.enabled

> **enabled**: `boolean`

##### loadersCache.revalidate

> **revalidate**: `number`

#### locales

> **locales**: `string`[]

Resolved locales for the Angular app. Always contains at least `defaultLanguage`.

***

### api

> **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \} \| `undefined`\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \} \| `undefined`\>; \}\>

Defined in: packages/content/types/config/models.d.ts:27

API settings required to connect to Sitecore.
Both edge and local sets can be specified; the Content SDK app will choose
the correct credentials (Edge or local) at runtime.

#### Inherited from

`Omit.api`

***

### defaultLanguage

> **defaultLanguage**: `string`

Defined in: packages/content/types/config/models.d.ts:71

The default and fallback locale for your site.
Ensure it aligns with the framework-specific settings used in your application.

#### Inherited from

`Omit.defaultLanguage`

***

### defaultSite

> **defaultSite**: `string`

Defined in: packages/content/types/config/models.d.ts:75

Your default site name. When using the multisite feature this variable defines the fallback site.

#### Inherited from

`Omit.defaultSite`

***

### dictionary

> **dictionary**: `Required`\<\{ `caching?`: `Required`\<\{ `enabled?`: `boolean`; `timeout?`: `number`; \} \| `undefined`\>; \}\>

Defined in: packages/content/types/config/models.d.ts:114

Settings for Dictionary Service

#### Inherited from

`Omit.dictionary`

***

### disableCodeGeneration

> **disableCodeGeneration**: `boolean`

Defined in: packages/content/types/config/models.d.ts:208

Opt-out setting for code generation feature
Disables code extraction procedure

#### Inherited from

`Omit.disableCodeGeneration`

***

### editingSecret

> **editingSecret**: `string`

Defined in: packages/content/types/config/models.d.ts:80

Editing secret required for Sitecore editing and preview functionality.
Default comes from the SITECORE_EDITING_SECRET environment variable.

#### Inherited from

`Omit.editingSecret`

***

### layout

> **layout**: `Required`\<\{ `formatLayoutQuery?`: ((`siteName`, `itemPath`, `locale?`) => `string`) \| `null`; \}\>

Defined in: packages/content/types/config/models.d.ts:100

Settings for Layout Service

#### Inherited from

`Omit.layout`

***

### multisite

> **multisite**: `Required`\<\{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => `boolean`; \}\>

Defined in: packages/content/types/config/models.d.ts:126

Settings for multisite functionality

#### Inherited from

`Omit.multisite`

***

### personalize

> **personalize**: `Required`\<\{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \}\>

Defined in: packages/content/types/config/models.d.ts:150

Settings for Personalize functionality

#### Inherited from

`Omit.personalize`

***

### redirects

> **redirects**: `Omit`\<[`SitecoreConfig`](../content/config/type-aliases/SitecoreConfig.md)\[`"redirects"`\], `"locales"`\>

Defined in: [packages/angular/src/config/define-config.ts:56](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/angular/src/config/define-config.ts#L56)

***

### retries

> **retries**: `Required`\<\{ `count?`: `number`; `retryStrategy?`: `RetryStrategy`; \}\>

Defined in: packages/content/types/config/models.d.ts:84

Retry configuration applied to Layout, Dictionary and ErrorPages services

#### Inherited from

`Omit.retries`

***

### rewriteMediaUrls

> **rewriteMediaUrls**: `boolean` \| ((`value`) => `string`)

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
