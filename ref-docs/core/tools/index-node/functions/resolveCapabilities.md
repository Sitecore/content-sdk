[**@sitecore-content-sdk/core**](../../../README.md)

***

[@sitecore-content-sdk/core](../../../README.md) / [tools/index-node](../README.md) / resolveCapabilities

# Function: resolveCapabilities()

> **resolveCapabilities**(`capabilities`, `context`): `Promise`\<[`ResolvedCapabilities`](../../../index/type-aliases/ResolvedCapabilities.md)\>

Defined in: [packages/core/src/tools/capabilities/index.ts:183](https://github.com/Sitecore/content-sdk/blob/84b2ebcb77b1c88a88e7b2b7d4b9b7117148025d/packages/core/src/tools/capabilities/index.ts#L183)

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
