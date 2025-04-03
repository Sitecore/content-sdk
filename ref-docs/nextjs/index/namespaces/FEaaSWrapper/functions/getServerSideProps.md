[**@sitecore-content-sdk/nextjs**](../../../../README.md)

***

[@sitecore-content-sdk/nextjs](../../../../README.md) / [index](../../../README.md) / [FEaaSWrapper](../README.md) / getServerSideProps

# Function: getServerSideProps()

> **getServerSideProps**(`rendering`, `layoutData`, `context`): `Promise`\<`unknown`\>

Defined in: [nextjs/src/components/FEaaSWrapper.tsx:38](https://github.com/Sitecore/content-sdk/blob/8b95896c4f9d2f6a2c452ee63406a9f69e9ab407/packages/nextjs/src/components/FEaaSWrapper.tsx#L38)

Will be called during SSR

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rendering` | [`ComponentRendering`](../../../interfaces/ComponentRendering.md) |  |
| `layoutData` | [`LayoutServiceData`](../../../interfaces/LayoutServiceData.md) |  |
| `context` | `GetServerSidePropsContext` | - |

## Returns

`Promise`\<`unknown`\>

context
