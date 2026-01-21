[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / writeImportMap

# Function: writeImportMap()

> **writeImportMap**(`args`): (`__namedParameters`) => `Promise`\<`void`\>

Defined in: [packages/core/src/tools/codegen/import-map.ts:404](https://github.com/Sitecore/content-sdk/blob/8dcb9d458e61f7c39bf98898c9a004ce461038f8/packages/core/src/tools/codegen/import-map.ts#L404)

Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | [`WriteImportMapArgsInternal`](../type-aliases/WriteImportMapArgsInternal.md) | include/exclude paths settings to be processed for import-map, and the Sitecore configuration. |

## Returns

> (`__namedParameters`): `Promise`\<`void`\>

### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `scConfig?`: `Required`\<\{ `api?`: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: ...; `contextId`: ...; `edgeUrl?`: ...; \} \| `undefined`\>; `local?`: `Required`\<\{ `apiHost`: ...; `apiKey`: ...; `path?`: ...; \} \| `undefined`\>; \} \| `undefined`\>; `defaultLanguage?`: `string`; `defaultSite?`: `string`; `dictionary?`: `Required`\<\{ `caching?`: `Required`\<\{ `enabled?`: ...; `timeout?`: ...; \} \| `undefined`\>; \} \| `undefined`\>; `disableCodeGeneration?`: `boolean`; `editingSecret?`: `string`; `layout?`: `Required`\<\{ `formatLayoutQuery?`: (`siteName`, `itemPath`, `locale?`) => `string` \| `null`; \} \| `undefined`\>; `multisite?`: `Required`\<\{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => `boolean`; \} \| `undefined`\>; `personalize?`: `Required`\<\{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \} \| `undefined`\>; `redirects?`: `Required`\<\{ `enabled?`: `boolean`; `locales?`: `string`[]; \} \| `undefined`\>; `retries?`: `Required`\<\{ `count?`: `number`; `retryStrategy?`: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md); \} \| `undefined`\>; \}\>; \} |
| `__namedParameters.scConfig?` | `Required`\<\{ `api?`: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: ...; `contextId`: ...; `edgeUrl?`: ...; \} \| `undefined`\>; `local?`: `Required`\<\{ `apiHost`: ...; `apiKey`: ...; `path?`: ...; \} \| `undefined`\>; \} \| `undefined`\>; `defaultLanguage?`: `string`; `defaultSite?`: `string`; `dictionary?`: `Required`\<\{ `caching?`: `Required`\<\{ `enabled?`: ...; `timeout?`: ...; \} \| `undefined`\>; \} \| `undefined`\>; `disableCodeGeneration?`: `boolean`; `editingSecret?`: `string`; `layout?`: `Required`\<\{ `formatLayoutQuery?`: (`siteName`, `itemPath`, `locale?`) => `string` \| `null`; \} \| `undefined`\>; `multisite?`: `Required`\<\{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => `boolean`; \} \| `undefined`\>; `personalize?`: `Required`\<\{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \} \| `undefined`\>; `redirects?`: `Required`\<\{ `enabled?`: `boolean`; `locales?`: `string`[]; \} \| `undefined`\>; `retries?`: `Required`\<\{ `count?`: `number`; `retryStrategy?`: [`RetryStrategy`](../../index/interfaces/RetryStrategy.md); \} \| `undefined`\>; \}\> |

### Returns

`Promise`\<`void`\>
