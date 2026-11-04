[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / resolveCapabilities

# Function: resolveCapabilities()

> **resolveCapabilities**(`capabilities`, `context`): `Promise`\<[`ResolvedCapabilities`](../../../index/type-aliases/ResolvedCapabilities.md)\>

Defined in: [packages/core/src/tools/capabilities/index.ts:178](https://github.com/Sitecore/content-sdk/blob/85bfea16a8a93e2d5b0410a454a1d882cebba54b/packages/core/src/tools/capabilities/index.ts#L178)

**`Internal`**

Resolves filters and removes disabled capabilities.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `capabilities` | [`MergedCapabilityTree`](../type-aliases/MergedCapabilityTree.md) | merged capability tree |
| `context` | [`CapabilityFilterContext`](../../../index/type-aliases/CapabilityFilterContext.md) | application inspection context |

## Returns

`Promise`\<[`ResolvedCapabilities`](../../../index/type-aliases/ResolvedCapabilities.md)\>

enabled capability keys
