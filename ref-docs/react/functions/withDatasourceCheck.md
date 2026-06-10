[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withDatasourceCheck

# Function: withDatasourceCheck()

> **withDatasourceCheck**(`options?`): \<`ComponentProps`\>(`Component`) => (`props`) => `Element` \| `null`

Defined in: [packages/react/src/enhancers/withDatasourceCheck.tsx:32](https://github.com/Sitecore/content-sdk/blob/0325d614f670aabc44a25c7deff996ace6a1fe8c/packages/react/src/enhancers/withDatasourceCheck.tsx#L32)

Checks whether a Sitecore datasource is present and renders appropriately depending on page mode (normal vs editing).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | `WithDatasourceCheckOptions` | - |

## Returns

The wrapped component, if a datasource is present.
 A null component (in normal mode) or an error component (in editing mode), if a datasource is not present.

\<`ComponentProps`\>(`Component`) => (`props`) => `Element` \| `null`
