[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / FEaaSCacheComponentsServerWrapper

# Function: FEaaSCacheComponentsServerWrapper()

> **FEaaSCacheComponentsServerWrapper**(`props`): `Element`

Defined in: [nextjs/src/components/FEaaSCacheComponentsServerWrapper.tsx:17](https://github.com/Sitecore/content-sdk/blob/84b2ebcb77b1c88a88e7b2b7d4b9b7117148025d/packages/nextjs/src/components/FEaaSCacheComponentsServerWrapper.tsx#L17)

FEaaS server component for Cache Components apps. Renders `FEaaSServerWrapper` at request time
behind `<Suspense>`, so the rest of the page can be prerendered. Requires `cacheComponents: true`.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `props` | `FEaaSServerWrapperProps` | incoming props |

## Returns

`Element`

FEaaS component wrapped in Suspense
