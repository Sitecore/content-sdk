[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [utils](../README.md) / isShortISODateString

# Function: isShortISODateString()

> **isShortISODateString**(`date`): `boolean`

Defined in: [analytics-core/src/utils/validators/is-short-iso-date-string.ts:7](https://github.com/Sitecore/content-sdk/blob/d9d50e1e9cf196032766ca4287d4c24576cabbd6/packages/analytics-core/src/utils/validators/is-short-iso-date-string.ts#L7)

**`Internal`**

Checks if the provided string matches the shortened ISO 8601 format (`YYYY-MM-DDThh:mm`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `date` | `string` | The date string to validate. |

## Returns

`boolean`

True when the value conforms to the shortened ISO format.
