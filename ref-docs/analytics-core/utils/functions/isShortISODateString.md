[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [utils](../README.md) / isShortISODateString

# Function: isShortISODateString()

> **isShortISODateString**(`date`): `boolean`

Defined in: [analytics-core/src/utils/validators/is-short-iso-date-string.ts:7](https://github.com/Sitecore/content-sdk/blob/d5ea81c08b96d9a7a94e6b7a230773c14fa1940d/packages/analytics-core/src/utils/validators/is-short-iso-date-string.ts#L7)

**`Internal`**

Checks if the provided string matches the shortened ISO 8601 format (`YYYY-MM-DDThh:mm`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `date` | `string` | The date string to validate. |

## Returns

`boolean`

True when the value conforms to the shortened ISO format.
