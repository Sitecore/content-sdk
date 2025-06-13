[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / isRegexOrUrl

# Function: isRegexOrUrl()

> **isRegexOrUrl**(`input`): `"regex"` \| `"url"`

Defined in: [packages/core/src/utils/utils.ts:162](https://github.com/Sitecore/content-sdk/blob/ecae9ef8366da2af76c08697466d1cf2204de095/packages/core/src/utils/utils.ts#L162)

Determines whether the given input is a regular expression or resembles a URL.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The input string to evaluate. |

## Returns

`"regex"` \| `"url"`

- Returns 'url' if the input looks like a URL, otherwise 'regex'.
