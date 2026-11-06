[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [utils](../README.md) / isValidISODateAndTimeString

# Function: isValidISODateAndTimeString()

> **isValidISODateAndTimeString**(`date`): `boolean`

Defined in: [analytics-core/src/utils/validators/is-valid-iso-date-and-time-string.ts:7](https://github.com/Sitecore/content-sdk/blob/8fa5fac9f3a10278127871abd6e608e014e74155/packages/analytics-core/src/utils/validators/is-valid-iso-date-and-time-string.ts#L7)

**`Internal`**

Checks if the provided string matches the shortened date and time ISO 8601 format (`YYYY-MM-DDThh:mm`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `date` | `string` | The date string to validate. |

## Returns

`boolean`

True when the value conforms to the shortened ISO format.
