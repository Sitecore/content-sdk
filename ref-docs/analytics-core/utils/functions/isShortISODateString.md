[**@sitecore-content-sdk/analytics-core**](../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../README.md) / [utils](../README.md) / isShortISODateString

# Function: isShortISODateString()

> **isShortISODateString**(`date`): `boolean`

Defined in: [analytics-core/src/utils/validators/is-short-iso-date-string.ts:7](https://github.com/Sitecore/content-sdk/blob/a14a2c51503b49ea7ea41b8f72b87fbf90dd83d7/packages/analytics-core/src/utils/validators/is-short-iso-date-string.ts#L7)

**`Internal`**

Checks if the provided string matches the shortened ISO 8601 format (`YYYY-MM-DDThh:mm`).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `date` | `string` | The date string to validate. |

## Returns

`boolean`

True when the value conforms to the shortened ISO format.
