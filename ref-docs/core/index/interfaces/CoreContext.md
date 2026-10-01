[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CoreContext

# Interface: CoreContext

Defined in: [packages/core/src/initialization/types.ts:29](https://github.com/Sitecore/content-sdk/blob/d6b8d754abd1b9d0b9c44ac6c3c4eb267322689a/packages/core/src/initialization/types.ts#L29)

**`Internal`**

Internal config of the SDK initialization

## Properties

### config

> **config**: `object`

Defined in: [packages/core/src/initialization/types.ts:33](https://github.com/Sitecore/content-sdk/blob/d6b8d754abd1b9d0b9c44ac6c3c4eb267322689a/packages/core/src/initialization/types.ts#L33)

The SDK initialization config

#### contextId

> **contextId**: `string`

#### edgeUrl

> **edgeUrl**: `string`

#### siteName

> **siteName**: `string`

***

### plugins

> **plugins**: `Map`\<`string`, [`Plugin`](Plugin.md)\<`unknown`, `unknown`\>\>

Defined in: [packages/core/src/initialization/types.ts:37](https://github.com/Sitecore/content-sdk/blob/d6b8d754abd1b9d0b9c44ac6c3c4eb267322689a/packages/core/src/initialization/types.ts#L37)

Map of enabled plugins by name

***

### readyPromise

> **readyPromise**: `Promise`\<`void`\> \| `null`

Defined in: [packages/core/src/initialization/types.ts:41](https://github.com/Sitecore/content-sdk/blob/d6b8d754abd1b9d0b9c44ac6c3c4eb267322689a/packages/core/src/initialization/types.ts#L41)

Promise that resolves when initialization is complete
