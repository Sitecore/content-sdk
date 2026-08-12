[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / getEnforcedCorsHeaders

# Function: getEnforcedCorsHeaders()

> **getEnforcedCorsHeaders**(`__namedParameters`): `null` \| \{\[`key`: `string`\]: `string`; \}

Defined in: [packages/core/src/utils/utils.ts:171](https://github.com/Sitecore/content-sdk/blob/5e586300554a131c9488a0b89af8f85d395d0b88/packages/core/src/utils/utils.ts#L171)

Gets enforced CORS headers

## Parameters

| Parameter | Type |
| ------ | ------ |
| `__namedParameters` | \{ `allowedOrigins?`: `string`[]; `headers`: `Headers` \| `IncomingHttpHeaders`; `presetCorsHeader?`: `string` \| `string`[]; `requestMethod`: `undefined` \| `string`; \} |
| `__namedParameters.allowedOrigins?` | `string`[] |
| `__namedParameters.headers` | `Headers` \| `IncomingHttpHeaders` |
| `__namedParameters.presetCorsHeader?` | `string` \| `string`[] |
| `__namedParameters.requestMethod` | `undefined` \| `string` |

## Returns

`null` \| \{\[`key`: `string`\]: `string`; \}

- The enforced CORS headers.
