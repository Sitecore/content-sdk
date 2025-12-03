[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withDatasourceCheck

# Function: withDatasourceCheck()

> **withDatasourceCheck**(`options?`): \<`ComponentProps`\>(`Component`) => (`props`) => `null` \| `Element`

Defined in: [packages/react/src/enhancers/withDatasourceCheck.tsx:31](https://github.com/Sitecore/content-sdk/blob/c1fd60008e2a47b74892c00f1b7c89e3813a6047/packages/react/src/enhancers/withDatasourceCheck.tsx#L31)

Checks whether a Sitecore datasource is present and renders appropriately depending on page mode (normal vs editing).

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | `WithDatasourceCheckOptions` |  |

## Returns

The wrapped component, if a datasource is present.
 A null component (in normal mode) or an error component (in editing mode), if a datasource is not present.

> \<`ComponentProps`\>(`Component`): (`props`) => `null` \| `Element`

### Type Parameters

| Type Parameter |
| ------ |
| `ComponentProps` *extends* `WithDatasourceCheckProps` |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `Component` | `ComponentType`\<`ComponentProps`\> |

### Returns

> (`props`): `null` \| `Element`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `ComponentProps` |

#### Returns

`null` \| `Element`
