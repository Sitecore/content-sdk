[**@sitecore-content-sdk/angular**](../../README.md)

***

[@sitecore-content-sdk/angular](../../README.md) / [lib](../README.md) / AngularCSDKAppInit

# Interface: AngularCSDKAppInit

Defined in: [packages/angular/src/lib/providers.ts:25](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/lib/providers.ts#L25)

Configuration for the Sitecore Angular SDK.

## Properties

### errorRoute?

> `optional` **errorRoute?**: `string`

Defined in: [packages/angular/src/lib/providers.ts:37](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/lib/providers.ts#L37)

***

### notFoundRoute?

> `optional` **notFoundRoute?**: `string`

Defined in: [packages/angular/src/lib/providers.ts:36](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/lib/providers.ts#L36)

***

### sitecoreClient?

> `optional` **sitecoreClient?**: [`SitecoreClient`](../content/client/classes/SitecoreClient.md)

Defined in: [packages/angular/src/lib/providers.ts:35](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/lib/providers.ts#L35)

Application-owned [SitecoreClient](../content/client/classes/SitecoreClient.md) instance (e.g. from a module singleton).
Required when [sitecoreConfig](#sitecoreconfig) is set; registered as [SITECORE\_CLIENT\_TOKEN](../variables/SITECORE_CLIENT_TOKEN.md).

***

### sitecoreConfig?

> `optional` **sitecoreConfig?**: `Required`\<\{ `angular?`: `Required`\<\{ `loadersCache?`: `Required`\<\{ `enabled?`: `boolean`; `revalidate?`: `number`; \} \| `undefined`\>; `locales?`: `string`[]; \} \| `undefined`\>; `api?`: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \} \| `undefined`\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \} \| `undefined`\>; \} \| `undefined`\>; `defaultLanguage?`: `string`; `defaultSite?`: `string`; `dictionary?`: `Required`\<\{ `caching?`: `Required`\<\{ `enabled?`: `boolean`; `timeout?`: `number`; \} \| `undefined`\>; \} \| `undefined`\>; `disableCodeGeneration?`: `boolean`; `editingSecret?`: `string`; `layout?`: `Required`\<\{ `formatLayoutQuery?`: ((`siteName`, `itemPath`, `locale?`) => `string`) \| `null`; \} \| `undefined`\>; `multisite?`: `Required`\<\{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => `boolean`; \} \| `undefined`\>; `personalize?`: `Required`\<\{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \} \| `undefined`\>; `redirects?`: `Required`\<\{ `enabled?`: `boolean`; `locales?`: `string`[]; \} \| `undefined`\>; `retries?`: `Required`\<\{ `count?`: `number`; `retryStrategy?`: `RetryStrategy`; \} \| `undefined`\>; `rewriteMediaUrls?`: `boolean` \| ((`value`) => `string`); \}\>

Defined in: [packages/angular/src/lib/providers.ts:30](https://github.com/Sitecore/content-sdk/blob/e22cfe2c02eee8993a7e1f934742492c457a5316/packages/angular/src/lib/providers.ts#L30)

Sitecore configuration (e.g. from sitecore.config.ts).
When provided, [sitecoreClient](#sitecoreclient) must also be set; both are registered for DI.
