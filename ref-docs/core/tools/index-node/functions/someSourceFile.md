[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / someSourceFile

# Function: someSourceFile()

> **someSourceFile**(`context`, `predicate`): `boolean`

Defined in: [packages/core/src/tools/capabilities/filter-utils.ts:17](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/tools/capabilities/filter-utils.ts#L17)

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
