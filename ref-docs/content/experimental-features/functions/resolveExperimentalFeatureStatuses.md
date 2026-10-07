[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [experimental-features](../README.md) / resolveExperimentalFeatureStatuses

# Function: resolveExperimentalFeatureStatuses()

> **resolveExperimentalFeatureStatuses**(`features`): [`ExperimentalFeatureStatus`](../type-aliases/ExperimentalFeatureStatus.md)[]

Defined in: [content/src/experimental-features/utils.ts:46](https://github.com/Sitecore/content-sdk/blob/16c65a296cb6c3751cf2bd6cd678c6ae93f8c499/packages/content/src/experimental-features/utils.ts#L46)

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
