[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / getEnforcedCorsHeaders

# Function: getEnforcedCorsHeaders()

> **getEnforcedCorsHeaders**(`requestMethod`): \{\[`key`: `string`\]: `string`; \} \| `null`

Defined in: [packages/core/src/utils/utils.ts:171](https://github.com/Sitecore/content-sdk/blob/c71aa78ec59bb08efdf821d01673c8efe517b118/packages/core/src/utils/utils.ts#L171)

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
