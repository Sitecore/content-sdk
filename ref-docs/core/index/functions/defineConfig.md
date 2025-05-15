[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / defineConfig

# Function: defineConfig()

> **defineConfig**(`config`): `Required`\<\{ `api?`: `Required`\<`undefined` \| \{ `edge?`: `Required`\<`undefined` \| \{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<`undefined` \| \{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>; `defaultLanguage?`: `string`; `defaultSite?`: `string`; `dictionary?`: `Required`\<`undefined` \| \{ `caching?`: `Required`\<`undefined` \| \{ `enabled?`: `boolean`; `timeout?`: `number`; \}\>; \}\>; `editingSecret?`: `string`; `layout?`: `Required`\<`undefined` \| \{ `formatLayoutQuery?`: `null` \| (`siteName`, `itemPath`, `locale?`) => `string`; \}\>; `multisite?`: `Required`\<`undefined` \| \{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => `boolean`; \}\>; `personalize?`: `Required`\<`undefined` \| \{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \}\>; `redirects?`: `Required`\<`undefined` \| \{ `enabled?`: `boolean`; `locales?`: `string`[]; \}\>; `retries?`: `Required`\<`undefined` \| \{ `count?`: `number`; `retryStrategy?`: [`RetryStrategy`](../interfaces/RetryStrategy.md); \}\>; \}\>

Defined in: [packages/core/src/config/define-config.ts:112](https://github.com/Sitecore/content-sdk/blob/4b51519c85e68fe45f6c2a51c165a6b484cea0c0/packages/core/src/config/define-config.ts#L112)

Accepts a SitecoreConfigInput object and returns full sitecore configuration

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`SitecoreConfigInput`](../../config/type-aliases/SitecoreConfigInput.md) | override values to be written over default config settings |

## Returns

`Required`\<\{ `api?`: `Required`\<`undefined` \| \{ `edge?`: `Required`\<`undefined` \| \{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<`undefined` \| \{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>; `defaultLanguage?`: `string`; `defaultSite?`: `string`; `dictionary?`: `Required`\<`undefined` \| \{ `caching?`: `Required`\<`undefined` \| \{ `enabled?`: `boolean`; `timeout?`: `number`; \}\>; \}\>; `editingSecret?`: `string`; `layout?`: `Required`\<`undefined` \| \{ `formatLayoutQuery?`: `null` \| (`siteName`, `itemPath`, `locale?`) => `string`; \}\>; `multisite?`: `Required`\<`undefined` \| \{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => `boolean`; \}\>; `personalize?`: `Required`\<`undefined` \| \{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \}\>; `redirects?`: `Required`\<`undefined` \| \{ `enabled?`: `boolean`; `locales?`: `string`[]; \}\>; `retries?`: `Required`\<`undefined` \| \{ `count?`: `number`; `retryStrategy?`: [`RetryStrategy`](../interfaces/RetryStrategy.md); \}\>; \}\>

full sitecore configuration to use in application
