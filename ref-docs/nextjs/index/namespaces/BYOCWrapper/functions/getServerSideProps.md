[**@sitecore-content-sdk/nextjs**](../../../../README.md)

***

[@sitecore-content-sdk/nextjs](../../../../README.md) / [index](../../../README.md) / [BYOCWrapper](../README.md) / getServerSideProps

# Function: getServerSideProps()

> **getServerSideProps**(`rendering`, `layoutData`, `context`): `Promise`\<`unknown`\>

Defined in: [nextjs/src/components/BYOCWrapper.tsx:33](https://github.com/Sitecore/content-sdk/blob/5668fc9a4560f7c5a529d356ffb07c3d7cb82d73/packages/nextjs/src/components/BYOCWrapper.tsx#L33)

Will be called during SSR

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rendering` | [`ComponentRendering`](../../../interfaces/ComponentRendering.md) |  |
| `layoutData` | [`LayoutServiceData`](../../../interfaces/LayoutServiceData.md) | - |
| `context` | `GetServerSidePropsContext` | - |

## Returns

`Promise`\<`unknown`\>

context
