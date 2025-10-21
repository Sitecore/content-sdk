[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / extractFiles

# Variable: extractFiles()

> **extractFiles**: (`args`) => (`__namedParameters`) => `Promise`\<`void`\> = `_extractFiles`

Defined in: [packages/core/src/tools/codegen/extract-files.ts:27](https://github.com/Sitecore/content-sdk/blob/6dc8e98dbbb7b7e5be9ff8107e95237d8311c7dc/packages/core/src/tools/codegen/extract-files.ts#L27)

Extracts components from the app folder and sends them to XMCloud.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `ExtractFilesConfig` | Config for components extraction |

## Returns

> (`__namedParameters`): `Promise`\<`void`\>

### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `scConfig?`: `Required`\<\{ `api?`: `Required`\<`undefined` \| \{ `edge?`: `Required`\<... \| ...\>; `local?`: `Required`\<... \| ...\>; \}\>; `defaultLanguage?`: `string`; `defaultSite?`: `string`; `dictionary?`: `Required`\<`undefined` \| \{ `caching?`: `Required`\<... \| ...\>; \}\>; `disableCodeGeneration?`: `boolean`; `editingSecret?`: `string`; `layout?`: `Required`\<`undefined` \| \{ `formatLayoutQuery?`: `null` \| (`siteName`, `itemPath`, `locale?`) => ...; \}\>; `multisite?`: `Required`\<`undefined` \| \{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => ...; \}\>; `personalize?`: `Required`\<`undefined` \| \{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \}\>; `redirects?`: `Required`\<`undefined` \| \{ `enabled?`: `boolean`; `locales?`: ...[]; \}\>; `retries?`: `Required`\<`undefined` \| \{ `count?`: `number`; `retryStrategy?`: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md); \}\>; \}\>; \} |
| `__namedParameters.scConfig?` | `Required`\<\{ `api?`: `Required`\<`undefined` \| \{ `edge?`: `Required`\<... \| ...\>; `local?`: `Required`\<... \| ...\>; \}\>; `defaultLanguage?`: `string`; `defaultSite?`: `string`; `dictionary?`: `Required`\<`undefined` \| \{ `caching?`: `Required`\<... \| ...\>; \}\>; `disableCodeGeneration?`: `boolean`; `editingSecret?`: `string`; `layout?`: `Required`\<`undefined` \| \{ `formatLayoutQuery?`: `null` \| (`siteName`, `itemPath`, `locale?`) => ...; \}\>; `multisite?`: `Required`\<`undefined` \| \{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => ...; \}\>; `personalize?`: `Required`\<`undefined` \| \{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \}\>; `redirects?`: `Required`\<`undefined` \| \{ `enabled?`: `boolean`; `locales?`: ...[]; \}\>; `retries?`: `Required`\<`undefined` \| \{ `count?`: `number`; `retryStrategy?`: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md); \}\>; \}\> |

### Returns

`Promise`\<`void`\>
