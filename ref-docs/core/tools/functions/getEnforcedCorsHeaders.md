[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / getEnforcedCorsHeaders

# Function: getEnforcedCorsHeaders()

> **getEnforcedCorsHeaders**(`options`): \{\[`key`: `string`\]: `string`; \} \| `null`

Defined in: [packages/core/src/tools/utils.ts:99](https://github.com/Sitecore/content-sdk/blob/27b90e02c7a030fc380d3d5e51ad2edbb3c50829/packages/core/src/tools/utils.ts#L99)

Gets enforced CORS headers

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | \{ `allowedOrigins?`: `string`[]; `headers`: `Headers` \| `IncomingHttpHeaders`; `presetCorsHeader?`: `string` \| `string`[]; `requestMethod`: `string` \| `undefined`; \} | The options |
| `options.allowedOrigins?` | `string`[] | The allowed origins. |
| `options.headers` | `Headers` \| `IncomingHttpHeaders` | The headers of the request. |
| `options.presetCorsHeader?` | `string` \| `string`[] | The preset CORS header. |
| `options.requestMethod` | `string` \| `undefined` | The HTTP method of the request. |

## Returns

\{\[`key`: `string`\]: `string`; \} \| `null`

- The enforced CORS headers.
