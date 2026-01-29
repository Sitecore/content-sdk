[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [tools](../README.md) / writeImportMap

# Function: writeImportMap()

> **writeImportMap**(`args`): (`__namedParameters`) => `Promise`\<`void`\>

Defined in: [content/src/tools/codegen/import-map.ts:392](https://github.com/Sitecore/content-sdk/blob/a268b42996e15dfe7c883c983d1b99c91b97a726/packages/content/src/tools/codegen/import-map.ts#L392)

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
| `__namedParameters` | \{ `scConfig?`: `Required`\<\{ `api?`: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: ...; `contextId`: ...; `edgeUrl?`: ...; \} \| `undefined`\>; `local?`: `Required`\<\{ `apiHost`: ...; `apiKey`: ...; `path?`: ...; \} \| `undefined`\>; \} \| `undefined`\>; `defaultLanguage?`: `string`; `defaultSite?`: `string`; `dictionary?`: `Required`\<\{ `caching?`: `Required`\<\{ `enabled?`: ...; `timeout?`: ...; \} \| `undefined`\>; \} \| `undefined`\>; `disableCodeGeneration?`: `boolean`; `editingSecret?`: `string`; `layout?`: `Required`\<\{ `formatLayoutQuery?`: (`siteName`, `itemPath`, `locale?`) => `string` \| `null`; \} \| `undefined`\>; `multisite?`: `Required`\<\{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => `boolean`; \} \| `undefined`\>; `personalize?`: `Required`\<\{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \} \| `undefined`\>; `redirects?`: `Required`\<\{ `enabled?`: `boolean`; `locales?`: `string`[]; \} \| `undefined`\>; `retries?`: `Required`\<\{ `count?`: `number`; `retryStrategy?`: [`RetryStrategy`](../../client/interfaces/RetryStrategy.md); \} \| `undefined`\>; \}\>; \} |
| `__namedParameters.scConfig?` | `Required`\<\{ `api?`: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: ...; `contextId`: ...; `edgeUrl?`: ...; \} \| `undefined`\>; `local?`: `Required`\<\{ `apiHost`: ...; `apiKey`: ...; `path?`: ...; \} \| `undefined`\>; \} \| `undefined`\>; `defaultLanguage?`: `string`; `defaultSite?`: `string`; `dictionary?`: `Required`\<\{ `caching?`: `Required`\<\{ `enabled?`: ...; `timeout?`: ...; \} \| `undefined`\>; \} \| `undefined`\>; `disableCodeGeneration?`: `boolean`; `editingSecret?`: `string`; `layout?`: `Required`\<\{ `formatLayoutQuery?`: (`siteName`, `itemPath`, `locale?`) => `string` \| `null`; \} \| `undefined`\>; `multisite?`: `Required`\<\{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => `boolean`; \} \| `undefined`\>; `personalize?`: `Required`\<\{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \} \| `undefined`\>; `redirects?`: `Required`\<\{ `enabled?`: `boolean`; `locales?`: `string`[]; \} \| `undefined`\>; `retries?`: `Required`\<\{ `count?`: `number`; `retryStrategy?`: [`RetryStrategy`](../../client/interfaces/RetryStrategy.md); \} \| `undefined`\>; \}\> |

### Returns

`Promise`\<`void`\>
