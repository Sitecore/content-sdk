[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [experimental-features](../README.md) / resolveExperimentalFeatureStatuses

# Function: resolveExperimentalFeatureStatuses()

> **resolveExperimentalFeatureStatuses**(`features`): [`ExperimentalFeatureStatus`](../type-aliases/ExperimentalFeatureStatus.md)[]

Defined in: [content/src/experimental-features/utils.ts:46](https://github.com/Sitecore/content-sdk/blob/330793b3538a3eba00242844c28348678a5704cf/packages/content/src/experimental-features/utils.ts#L46)

Resolves experimental feature metadata with current enabled status from env vars.
The global switch enables all experimental features. When it is off, feature
status falls back to individual feature env flags.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `features` | [`ExperimentalFeatureData`](../type-aliases/ExperimentalFeatureData.md)[] | Experimental features catalog from a framework package. |

## Returns

[`ExperimentalFeatureStatus`](../type-aliases/ExperimentalFeatureStatus.md)[]

Features with enabled status.
