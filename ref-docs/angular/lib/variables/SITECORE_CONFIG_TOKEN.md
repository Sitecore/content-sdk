[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [lib](../README.md) / SITECORE\_CONFIG\_TOKEN

# Variable: SITECORE\_CONFIG\_TOKEN

> `const` **SITECORE\_CONFIG\_TOKEN**: `InjectionToken`\<`Required`\<\{ `angular?`: `Required`\<\{ `loadersCache?`: `Required`\<\{ `enabled?`: `boolean`; `revalidate?`: `number`; \} \| `undefined`\>; `locales?`: `string`[]; \} \| `undefined`\>; `api?`: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \} \| `undefined`\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \} \| `undefined`\>; \} \| `undefined`\>; `defaultLanguage?`: `string`; `defaultSite?`: `string`; `dictionary?`: `Required`\<\{ `caching?`: `Required`\<\{ `enabled?`: `boolean`; `timeout?`: `number`; \} \| `undefined`\>; \} \| `undefined`\>; `disableCodeGeneration?`: `boolean`; `editingSecret?`: `string`; `layout?`: `Required`\<\{ `formatLayoutQuery?`: ((`siteName`, `itemPath`, `locale?`) => `string`) \| `null`; \} \| `undefined`\>; `multisite?`: `Required`\<\{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => `boolean`; \} \| `undefined`\>; `personalize?`: `Required`\<\{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \} \| `undefined`\>; `redirects?`: `Required`\<\{ `enabled?`: `boolean`; `locales?`: `string`[]; \} \| `undefined`\>; `retries?`: `Required`\<\{ `count?`: `number`; `retryStrategy?`: `RetryStrategy`; \} \| `undefined`\>; `rewriteMediaUrls?`: `boolean` \| ((`value`) => `string`); \}\>\>

Defined in: [packages/angular/src/lib/tokens.ts:12](https://github.com/Sitecore/content-sdk/blob/938ddb61579c0679f428b539202c0046ffa084a9/packages/angular/src/lib/tokens.ts#L12)

Injection token for the Sitecore configuration.
Provided by `provideSitecoreAngular({ sitecoreConfig, sitecoreClient })`. Inject this to read config app-wide.
`AngularSitecoreConfig` extends `SitecoreConfig`, so consumers that previously typed the
value as `SitecoreConfig` remain structurally compatible.
