[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / getEnforcedCorsHeaders

# Function: getEnforcedCorsHeaders()

> **getEnforcedCorsHeaders**(`requestMethod`): \{\[`key`: `string`\]: `string`; \} \| `null`

Defined in: [packages/core/src/utils/utils.ts:171](https://github.com/Sitecore/content-sdk/blob/989287a2df1ab364e25b013c2e5fd976abe491b5/packages/core/src/utils/utils.ts#L171)

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
