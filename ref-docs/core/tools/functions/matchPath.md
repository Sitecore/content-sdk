[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [tools](../README.md) / matchPath

# Function: matchPath()

> **matchPath**(`itemPath`, `compare`): `boolean`

Defined in: [packages/core/src/tools/templating/utils.ts:38](https://github.com/Sitecore/content-sdk/blob/272d88b6498b3e929c9ee618271795d978073c6f/packages/core/src/tools/templating/utils.ts#L38)

Compares two paths to determine if they match.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` | base path to compare against, can be absolute or relative |
| `compare` | `string` | comparer, can be relate, absolute or regex string |

## Returns

`boolean`

true if paths match, false otherwise
