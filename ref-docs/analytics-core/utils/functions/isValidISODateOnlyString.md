[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [utils](../README.md) / isValidISODateOnlyString

# Function: isValidISODateOnlyString()

> **isValidISODateOnlyString**(`date`): `boolean`

Defined in: [analytics-core/src/utils/validators/is-valid-iso-date-only-string.ts:7](https://github.com/Sitecore/content-sdk/blob/5184ea7a4b946180169da0d19c7f8f7d61b0c8ec/packages/analytics-core/src/utils/validators/is-valid-iso-date-only-string.ts#L7)

**`Internal`**

Checks if the provided string matches the shortened date only ISO 8601 format (`YYYY-MM-DD`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `date` | `string` | The date string to validate. |

## Returns

`boolean`

True when the value conforms to the shortened ISO format.
