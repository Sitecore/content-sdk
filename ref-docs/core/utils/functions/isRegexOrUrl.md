[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / isRegexOrUrl

# Function: isRegexOrUrl()

> **isRegexOrUrl**(`input`): `"regex"` \| `"url"`

Defined in: [packages/core/src/utils/utils.ts:228](https://github.com/Sitecore/content-sdk/blob/8dcb9d458e61f7c39bf98898c9a004ce461038f8/packages/core/src/utils/utils.ts#L228)

Determines whether the given input is a regular expression or resembles a URL.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The input string to evaluate. |

## Returns

`"regex"` \| `"url"`

- Returns 'url' if the input looks like a URL, otherwise 'regex'.
