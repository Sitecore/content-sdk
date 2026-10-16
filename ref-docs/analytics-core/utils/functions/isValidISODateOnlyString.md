[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [utils](../README.md) / isValidISODateOnlyString

# Function: isValidISODateOnlyString()

> **isValidISODateOnlyString**(`date`): `boolean`

Defined in: [analytics-core/src/utils/validators/is-valid-iso-date-only-string.ts:7](https://github.com/Sitecore/content-sdk/blob/96d36170a4e88e0d43d2575e3412e8921e0a8da8/packages/analytics-core/src/utils/validators/is-valid-iso-date-only-string.ts#L7)

**`Internal`**

Checks if the provided string matches the shortened date only ISO 8601 format (`YYYY-MM-DD`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `date` | `string` | The date string to validate. |

## Returns

`boolean`

True when the value conforms to the shortened ISO format.
