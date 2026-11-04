[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [internal](../README.md) / language

# Function: language()

> **language**(): `string` \| `undefined`

Defined in: [analytics-core/src/infer/infer.ts:7](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/analytics-core/src/infer/infer.ts#L7)

**`Internal`**

Returns the uppercase language code of the current web page's root HTML element, using the `lang` attribute.
If unavailable or invalid, undefined is returned.

## Returns

`string` \| `undefined`

The language attribute or undefined.
