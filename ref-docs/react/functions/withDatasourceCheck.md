[**@sitecore-content-sdk/react**](../README.md)

---

[@sitecore-content-sdk/react](../README.md) / withDatasourceCheck

# Function: withDatasourceCheck()

> **withDatasourceCheck**(`options?`): \<`ComponentProps`\>(`Component`) => (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withDatasourceCheck.tsx:30](https://github.com/Sitecore/content-sdk/blob/d60a82d1a68474e16b7f78b07443588ed56138bb/packages/react/src/enhancers/withDatasourceCheck.tsx#L30)

Checks whether a Sitecore datasource is present and renders appropriately depending on page mode (normal vs editing).

## Parameters

| Parameter  | Type                         | Description |
| ---------- | ---------------------------- | ----------- |
| `options?` | `WithDatasourceCheckOptions` |             |

## Returns

The wrapped component, if a datasource is present.
A null component (in normal mode) or an error component (in editing mode), if a datasource is not present.

> \<`ComponentProps`\>(`Component`): (`props`) => `Element`

### Type Parameters

| Type Parameter                                        |
| ----------------------------------------------------- |
| `ComponentProps` _extends_ `WithDatasourceCheckProps` |

### Parameters

| Parameter   | Type                                |
| ----------- | ----------------------------------- |
| `Component` | `ComponentType`\<`ComponentProps`\> |

### Returns

> (`props`): `Element`

#### Parameters

| Parameter | Type             |
| --------- | ---------------- |
| `props`   | `ComponentProps` |

#### Returns

`Element`
