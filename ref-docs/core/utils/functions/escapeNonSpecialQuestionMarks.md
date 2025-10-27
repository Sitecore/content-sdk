[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / escapeNonSpecialQuestionMarks

# Function: escapeNonSpecialQuestionMarks()

> **escapeNonSpecialQuestionMarks**(`input`): `string`

Defined in: [packages/core/src/utils/utils.ts:252](https://github.com/Sitecore/content-sdk/blob/875026478718f4c8b8e0a7ccb65eac312b3fb4f6/packages/core/src/utils/utils.ts#L252)

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
