[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [tools](../README.md) / writeImportMap

# Function: writeImportMap()

> **writeImportMap**(`args`): (`__namedParameters?`) => `Promise`\<`void`\>

Defined in: [nextjs/src/tools/codegen/import-map.ts:16](https://github.com/Sitecore/content-sdk/blob/d905c41e68457d1a6a8bb86464339100ff85d126/packages/nextjs/src/tools/codegen/import-map.ts#L16)

Entry point function for generating import-map. Parses provided paths and outputs the modules and imports from those files into .sitecore/import-map.ts

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `args` | `WriteImportMapArgs` | include/exclude paths settings to be processed for import-map, and the Sitecore configuration. |

## Returns

> (`__namedParameters?`): `Promise`\<`void`\>

### Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters?` | \{ `scConfig?`: `Required`\<\{ `api?`: `Required`\<\{ `edge?`: `Required`\<... \| ...\>; `local?`: `Required`\<... \| ...\>; \} \| `undefined`\>; `defaultLanguage?`: `string`; `defaultSite?`: `string`; `dictionary?`: `Required`\<\{ `caching?`: `Required`\<... \| ...\>; \} \| `undefined`\>; `disableCodeGeneration?`: `boolean`; `editingSecret?`: `string`; `layout?`: `Required`\<\{ `formatLayoutQuery?`: (`siteName`, `itemPath`, `locale?`) => ... \| `null`; \} \| `undefined`\>; `multisite?`: `Required`\<\{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => ...; \} \| `undefined`\>; `personalize?`: `Required`\<\{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \} \| `undefined`\>; `redirects?`: `Required`\<\{ `enabled?`: `boolean`; `locales?`: ...[]; \} \| `undefined`\>; `retries?`: `Required`\<\{ `count?`: `number`; `retryStrategy?`: [`RetryStrategy`](../../client/interfaces/RetryStrategy.md); \} \| `undefined`\>; \}\>; \} |
| `__namedParameters.scConfig?` | `Required`\<\{ `api?`: `Required`\<\{ `edge?`: `Required`\<... \| ...\>; `local?`: `Required`\<... \| ...\>; \} \| `undefined`\>; `defaultLanguage?`: `string`; `defaultSite?`: `string`; `dictionary?`: `Required`\<\{ `caching?`: `Required`\<... \| ...\>; \} \| `undefined`\>; `disableCodeGeneration?`: `boolean`; `editingSecret?`: `string`; `layout?`: `Required`\<\{ `formatLayoutQuery?`: (`siteName`, `itemPath`, `locale?`) => ... \| `null`; \} \| `undefined`\>; `multisite?`: `Required`\<\{ `enabled?`: `boolean`; `useCookieResolution?`: (`req?`, `res?`) => ...; \} \| `undefined`\>; `personalize?`: `Required`\<\{ `cdpTimeout?`: `number`; `channel?`: `string`; `currency?`: `string`; `edgeTimeout?`: `number`; `enabled?`: `boolean`; `scope?`: `string`; \} \| `undefined`\>; `redirects?`: `Required`\<\{ `enabled?`: `boolean`; `locales?`: ...[]; \} \| `undefined`\>; `retries?`: `Required`\<\{ `count?`: `number`; `retryStrategy?`: [`RetryStrategy`](../../client/interfaces/RetryStrategy.md); \} \| `undefined`\>; \}\> |

### Returns

`Promise`\<`void`\>
