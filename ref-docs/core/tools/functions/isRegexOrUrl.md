[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / isRegexOrUrl

# Function: isRegexOrUrl()

> **isRegexOrUrl**(`input`): `"regex"` \| `"url"`

Defined in: [packages/core/src/tools/utils.ts:156](https://github.com/Sitecore/content-sdk/blob/d153ea0b9ebac2083b9f58f493cfe6e81e7b4fb0/packages/core/src/tools/utils.ts#L156)

Determines whether the given input is a regular expression or resembles a URL.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The input string to evaluate. |

## Returns

`"regex"` \| `"url"`

- Returns 'url' if the input looks like a URL, otherwise 'regex'.
