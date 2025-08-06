[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / enforceCors

# Function: enforceCors()

> **enforceCors**(`req`, `res`, `allowedOrigins?`): `boolean`

<<<<<<< HEAD
Defined in: [packages/core/src/utils/utils.ts:116](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/core/src/utils/utils.ts#L116)
=======
Defined in: [packages/core/src/utils/utils.ts:116](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/core/src/utils/utils.ts#L116)
>>>>>>> dd686bb50 (Update API docs)

Tests origin from incoming request against allowed origins list that can be
set in JSS's JSS_ALLOWED_ORIGINS env variable, passed via allowedOrigins param and/or
be already set in Access-Control-Allow-Origin by other logic.
Applies Access-Control-Allow-Origin and Access-Control-Allow-Methods on match
Also applies Access-Control-Allow-Headers for preflight requests

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `req` | `IncomingMessage` | incoming request |
| `res` | `OutgoingMessage` | response to set CORS headers for |
| `allowedOrigins?` | `string`[] | additional list of origins to test against |

## Returns

`boolean`

true if incoming origin matches the allowed lists, false when it does not
