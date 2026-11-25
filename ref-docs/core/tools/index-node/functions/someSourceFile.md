[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / someSourceFile

# Function: someSourceFile()

> **someSourceFile**(`context`, `predicate`): `boolean`

Defined in: [packages/core/src/tools/capabilities/filter-utils.ts:17](https://github.com/Sitecore/content-sdk/blob/11719c29a76964a5138c9b66c4ad7c2c94a0da6d/packages/core/src/tools/capabilities/filter-utils.ts#L17)

**`Internal`**

Tests whether any application source file under `src` satisfies a predicate.
Declaration and test files are skipped, and the scan stops at the first match.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `context` | [`CapabilityFilterContext`](../../../index/type-aliases/CapabilityFilterContext.md) | filter context |
| `predicate` | (`source`) => `boolean` | test applied to each file's source code |

## Returns

`boolean`

whether any source file matches
