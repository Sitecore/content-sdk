[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / escapeNonSpecialQuestionMarks

# Function: escapeNonSpecialQuestionMarks()

> **escapeNonSpecialQuestionMarks**(`input`): `string`

Defined in: [packages/core/src/tools/utils.ts:205](https://github.com/Sitecore/content-sdk/blob/e1d01567743ba659061230b4c463eb068f9fd3da/packages/core/src/tools/utils.ts#L205)

Escapes non-special "?" characters in a string or regex.
- For regex patterns that start with `^` or end with `$`, it returns the pattern unchanged.
- For other strings, it escapes literal "?" characters but preserves regex quantifiers and special patterns.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The input string or regex pattern. |

## Returns

`string`

- The modified string or regex with non-special "?" characters escaped.
