[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / InitContentSdkParams

# Interface: InitContentSdkParams

Defined in: [packages/core/src/initialization/types.ts:5](https://github.com/Sitecore/content-sdk/blob/4ed8b0d2eae4c3a3380de61934b40365770bba80/packages/core/src/initialization/types.ts#L5)

Parameters for initContentSdk

## Properties

### config

> **config**: `object`

Defined in: [packages/core/src/initialization/types.ts:7](https://github.com/Sitecore/content-sdk/blob/4ed8b0d2eae4c3a3380de61934b40365770bba80/packages/core/src/initialization/types.ts#L7)

Initialization config

#### contextId

> **contextId**: `string`

The context ID.

#### edgeUrl?

> `optional` **edgeUrl?**: `string`

Sitecore edge URL

#### siteName

> **siteName**: `string`

The site name.

***

### plugins

> **plugins**: [`Plugin`](Plugin.md)\<`unknown`, `unknown`\>[]

Defined in: [packages/core/src/initialization/types.ts:22](https://github.com/Sitecore/content-sdk/blob/4ed8b0d2eae4c3a3380de61934b40365770bba80/packages/core/src/initialization/types.ts#L22)

Array of plugins to initialize
