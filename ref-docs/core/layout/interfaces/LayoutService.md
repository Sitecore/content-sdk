[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [layout](../README.md) / LayoutService

# Interface: LayoutService

Defined in: [packages/core/src/layout/layout-service.ts:4](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/core/src/layout/layout-service.ts#L4)

## Methods

### fetchLayoutData()

> **fetchLayoutData**(`itemPath`, `language`?, `req`?, `res`?): `Promise`\<[`LayoutServiceData`](LayoutServiceData.md)\>

Defined in: [packages/core/src/layout/layout-service.ts:13](https://github.com/Sitecore/xmc-jss-dev/blob/8e2aea64ecdce7bb4d961b7ce3c4a30f3682bd2c/packages/core/src/layout/layout-service.ts#L13)

Fetch layout data for an item.

#### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `itemPath` | `string` |  |
| `language`? | `string` |  |
| `req`? | `IncomingMessage` | Request instance |
| `res`? | `ServerResponse` | Response instance |

#### Returns

`Promise`\<[`LayoutServiceData`](LayoutServiceData.md)\>

layout data
