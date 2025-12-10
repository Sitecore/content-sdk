[**@sitecore-content-sdk/utils**](../README.md)

***

[@sitecore-content-sdk/utils](../README.md) / omit

# Function: omit()

> **omit**\<`Data`, `Keys`\>(`data`, `keys`): `Omit`\<`Data`, `Keys`\>

Defined in: [objects/omit.ts:7](https://github.com/Sitecore/content-sdk/blob/8e5f2b9913cec1e148485adebc3da876466ee643/packages/utils/src/objects/omit.ts#L7)

Omits the provided keys from the given object.

## Type Parameters

| Type Parameter |
| ------ |
| `Data` *extends* `object` |
| `Keys` *extends* `string` \| `number` \| `symbol` |

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `data` | `Data` | The source object. |
| `keys` | `Keys`[] | Keys to omit from the source object. |

## Returns

`Omit`\<`Data`, `Keys`\>

Object without the specified keys.
