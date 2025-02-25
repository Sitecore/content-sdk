[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / defineConfig

# Function: defineConfig()

> **defineConfig**(`config`): `Required`\<\{ `api`: `Required`\<\{ `edge`: `Required`\<`undefined` \| \{ `clientContextId`: `string`; `contextId`: `string`; `edgeUrl`: `string`; \}\>; `local`: `Required`\<`undefined` \| \{ `apiHost`: `string`; `apiKey`: `string`; `path`: `string`; \}\>; \}\>; `defaultLanguage`: `string`; `defaultSite`: `string`; `dictionary`: `Required`\<`undefined` \| \{ `caching`: `Required`\<`undefined` \| \{ `enabled`: `boolean`; `timeout`: `number`; \}\>; \}\>; `editingSecret`: `string`; `layout`: `Required`\<`undefined` \| \{ `formatLayoutQuery`: `null` \| (`siteName`, `itemPath`, `locale`?) => `string`; \}\>; `multisite`: `Required`\<\{ `defaultHostname`: `string`; `enabled`: `boolean`; `useCookieResolution`: (`req`?, `res`?) => `boolean`; \}\>; `personalize`: `Required`\<\{ `cdpTimeout`: `number`; `channel`: `string`; `currency`: `string`; `edgeTimeout`: `number`; `enabled`: `boolean`; `scope`: `undefined` \| `string`; \}\>; `redirects`: `Required`\<\{ `enabled`: `boolean`; `locales`: `string`[]; \}\>; `retries`: `Required`\<`undefined` \| \{ `count`: `number`; `retryStrategy`: [`RetryStrategy`](../interfaces/RetryStrategy.md); \}\>; \}\>

Defined in: [packages/core/src/config/define-config.ts:116](https://github.com/Sitecore/xmc-jss-dev/blob/6619215c196ddf4b0e5218da4ae20a7b80c4f154/packages/core/src/config/define-config.ts#L116)

Accepts a SitecoreConfigInput object and returns full sitecore configuration

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `config` | [`SitecoreConfigInput`](../../config/type-aliases/SitecoreConfigInput.md) | override values to be written over default config settings |

## Returns

`Required`\<\{ `api`: `Required`\<\{ `edge`: `Required`\<`undefined` \| \{ `clientContextId`: `string`; `contextId`: `string`; `edgeUrl`: `string`; \}\>; `local`: `Required`\<`undefined` \| \{ `apiHost`: `string`; `apiKey`: `string`; `path`: `string`; \}\>; \}\>; `defaultLanguage`: `string`; `defaultSite`: `string`; `dictionary`: `Required`\<`undefined` \| \{ `caching`: `Required`\<`undefined` \| \{ `enabled`: `boolean`; `timeout`: `number`; \}\>; \}\>; `editingSecret`: `string`; `layout`: `Required`\<`undefined` \| \{ `formatLayoutQuery`: `null` \| (`siteName`, `itemPath`, `locale`?) => `string`; \}\>; `multisite`: `Required`\<\{ `defaultHostname`: `string`; `enabled`: `boolean`; `useCookieResolution`: (`req`?, `res`?) => `boolean`; \}\>; `personalize`: `Required`\<\{ `cdpTimeout`: `number`; `channel`: `string`; `currency`: `string`; `edgeTimeout`: `number`; `enabled`: `boolean`; `scope`: `undefined` \| `string`; \}\>; `redirects`: `Required`\<\{ `enabled`: `boolean`; `locales`: `string`[]; \}\>; `retries`: `Required`\<`undefined` \| \{ `count`: `number`; `retryStrategy`: [`RetryStrategy`](../interfaces/RetryStrategy.md); \}\>; \}\>

full sitecore configuration to use in application
