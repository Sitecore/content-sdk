[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / FEaaSCacheComponentsServerWrapper

# Function: FEaaSCacheComponentsServerWrapper()

> **FEaaSCacheComponentsServerWrapper**(`props`): `Element`

Defined in: [nextjs/src/components/FEaaSCacheComponentsServerWrapper.tsx:17](https://github.com/Sitecore/content-sdk/blob/51a9829bf867488124b20691dcc78e44f942c3db/packages/nextjs/src/components/FEaaSCacheComponentsServerWrapper.tsx#L17)

FEaaS server component for Cache Components apps. Renders `FEaaSServerWrapper` at request time
behind `<Suspense>`, so the rest of the page can be prerendered. Requires `cacheComponents: true`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `FEaaSServerWrapperProps` | incoming props |

## Returns

`Element`

FEaaS component wrapped in Suspense
