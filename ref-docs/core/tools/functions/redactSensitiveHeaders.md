[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / redactSensitiveHeaders

# Function: redactSensitiveHeaders()

> **redactSensitiveHeaders**(`headers`): `Record`\<`string`, `string` \| `string`[]\>

Defined in: [packages/core/src/tools/redact-headers.ts:22](https://github.com/Sitecore/content-sdk/blob/3966c04d9148447d9abcf751cdefb214d74a9fb3/packages/core/src/tools/redact-headers.ts#L22)

**`Internal`**

Returns a copy of the headers with the values of sensitive headers (e.g. the editing secret)
replaced by [REDACTED\_HEADER\_VALUE](../variables/REDACTED_HEADER_VALUE.md), so request details can be logged without leaking them.
Header names are matched case-insensitively. The input object is not modified.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `headers` | `Record`\<`string`, `string` \| `string`[]\> | Headers as key/value pairs. |

## Returns

`Record`\<`string`, `string` \| `string`[]\>

Copy of the headers that is safe to log.
