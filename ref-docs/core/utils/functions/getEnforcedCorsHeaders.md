[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / getEnforcedCorsHeaders

# Function: getEnforcedCorsHeaders()

> **getEnforcedCorsHeaders**(`requestMethod`): \{\[`key`: `string`\]: `string`; \} \| `null`

Defined in: [packages/core/src/utils/utils.ts:171](https://github.com/Sitecore/content-sdk/blob/6eae15c675a64fb02f95da52f5ad7786bf53c7c0/packages/core/src/utils/utils.ts#L171)

Gets enforced CORS headers

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `requestMethod` | \{ `allowedOrigins?`: `string`[]; `headers`: `Headers` \| `IncomingHttpHeaders`; `presetCorsHeader?`: `string` \| `string`[]; `requestMethod`: `string` \| `undefined`; \} | The HTTP method of the request. |
| `requestMethod.allowedOrigins?` | `string`[] | - |
| `requestMethod.headers` | `Headers` \| `IncomingHttpHeaders` | - |
| `requestMethod.presetCorsHeader?` | `string` \| `string`[] | - |
| `requestMethod.requestMethod` | `string` \| `undefined` | - |

## Returns

\{\[`key`: `string`\]: `string`; \} \| `null`

- The enforced CORS headers.
