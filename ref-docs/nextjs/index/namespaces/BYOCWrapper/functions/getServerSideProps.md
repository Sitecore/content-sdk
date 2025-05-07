[**@sitecore-content-sdk/nextjs**](../../../../README.md)

***

[@sitecore-content-sdk/nextjs](../../../../README.md) / [index](../../../README.md) / [BYOCWrapper](../README.md) / getServerSideProps

# Function: getServerSideProps()

> **getServerSideProps**(`rendering`, `layoutData`, `context`): `Promise`\<`unknown`\>

Defined in: [nextjs/src/components/BYOCWrapper.tsx:33](https://github.com/Sitecore/content-sdk/blob/b60d4881ed47b9a004bc31855cb9a3fd1d4f6563/packages/nextjs/src/components/BYOCWrapper.tsx#L33)

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
