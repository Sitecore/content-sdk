[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / resolveCapabilities

# Function: resolveCapabilities()

> **resolveCapabilities**(`capabilities`, `context`): `Promise`\<[`ResolvedCapabilities`](../../../index/type-aliases/ResolvedCapabilities.md)\>

Defined in: [packages/core/src/tools/capabilities/index.ts:183](https://github.com/Sitecore/content-sdk/blob/5d6b10bbee4bce6e575bd048c07d2ee0751ac361/packages/core/src/tools/capabilities/index.ts#L183)

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
