[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / isRegexOrUrl

# Function: isRegexOrUrl()

> **isRegexOrUrl**(`input`): `"url"` \| `"regex"`

Defined in: [packages/core/src/utils/utils.ts:162](https://github.com/Sitecore/xmc-jss-dev/blob/7a47a67fd74bc6693c5676ead90b40a2c3227877/packages/core/src/utils/utils.ts#L162)

Determines whether the given input is a regular expression or resembles a URL.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The input string to evaluate. |

## Returns

`"url"` \| `"regex"`

- Returns 'url' if the input looks like a URL, otherwise 'regex'.
