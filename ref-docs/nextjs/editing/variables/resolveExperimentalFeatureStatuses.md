[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [editing](../README.md) / resolveExperimentalFeatureStatuses

# Variable: resolveExperimentalFeatureStatuses

> `const` **resolveExperimentalFeatureStatuses**: (`features`) => [`ExperimentalFeatureStatus`](../type-aliases/ExperimentalFeatureStatus.md)[]

Defined in: content/types/experimental-features/utils.d.ts:16

Resolves experimental feature metadata with current enabled status from env vars.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `features` | [`ExperimentalFeatureData`](../type-aliases/ExperimentalFeatureData.md)[] | Experimental features catalog from a framework package. |

## Returns

[`ExperimentalFeatureStatus`](../type-aliases/ExperimentalFeatureStatus.md)[]

Features with enabled status.
