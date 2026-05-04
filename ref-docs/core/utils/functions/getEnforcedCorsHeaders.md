[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / getEnforcedCorsHeaders

# Function: getEnforcedCorsHeaders()

> **getEnforcedCorsHeaders**(`__namedParameters`): `null` \| \{\[`key`: `string`\]: `string`; \}

Defined in: [packages/core/src/utils/utils.ts:171](https://github.com/Sitecore/content-sdk/blob/599f6a8824eb73e29b1214dab65afe48894d64b0/packages/core/src/utils/utils.ts#L171)

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
