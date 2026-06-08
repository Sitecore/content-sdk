[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / matchPath

# Function: matchPath()

> **matchPath**(`itemPath`, `compare`): `boolean`

Defined in: [packages/core/src/tools/templating/utils.ts:39](https://github.com/Sitecore/content-sdk/blob/ced9004d90ba6b8b63f83181298ad2b2cc675297/packages/core/src/tools/templating/utils.ts#L39)

Compares two paths to determine if they match.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | base path to compare against, can be absolute or relative |
| `compare` | `string` | comparer, can be relate, absolute or regex string |

## Returns

`boolean`

true if paths match, false otherwise
