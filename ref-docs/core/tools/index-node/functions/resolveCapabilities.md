[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / resolveCapabilities

# Function: resolveCapabilities()

> **resolveCapabilities**(`capabilities`, `context`): `Promise`\<[`ResolvedCapabilities`](../../../index/type-aliases/ResolvedCapabilities.md)\>

Defined in: [packages/core/src/tools/capabilities/index.ts:183](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/tools/capabilities/index.ts#L183)

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
