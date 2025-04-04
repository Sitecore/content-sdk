[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [utils](../README.md) / escapeNonSpecialQuestionMarks

# Function: escapeNonSpecialQuestionMarks()

> **escapeNonSpecialQuestionMarks**(`input`): `string`

Defined in: [packages/core/src/utils/utils.ts:204](https://github.com/Sitecore/content-sdk/blob/5647269998b9306151914ae421806dad763f924a/packages/core/src/utils/utils.ts#L204)

Escapes non-special "?" characters in a string or regex.
- For regular strings, it escapes all unescaped "?" characters by adding a backslash (`\`).
- For regex patterns (strings enclosed in `/.../`), it analyzes each "?" to determine if it has special meaning
  (e.g., `?` in `(abc)?`, `.*?`, `(?!...)`) or is just a literal character. Only literal "?" characters are escaped.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `string` | The input string or regex pattern. |

## Returns

`string`

- The modified string or regex with non-special "?" characters escaped.
