[**@sitecore-content-sdk/utils**](../README.md)

***

[@sitecore-content-sdk/utils](../README.md) / normalizeHeaders

# Function: normalizeHeaders()

> **normalizeHeaders**(`incomingHeaders`): `Record`\<`string`, `string` \| `string`[]\>

Defined in: [converters/normalizeHeaders.ts:6](https://github.com/Sitecore/content-sdk/blob/2646e29add542674aa036ec1a2cad4404a52dd59/packages/utils/src/converters/normalizeHeaders.ts#L6)

Converts headers from various formats into a uniform key-value pair object.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `incomingHeaders` | `HeadersInit` | Incoming headers such as a Headers instance or plain object. |

## Returns

`Record`\<`string`, `string` \| `string`[]\>

Normalized headers as key-value pairs.
