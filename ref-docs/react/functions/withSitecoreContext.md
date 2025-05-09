[**@sitecore-content-sdk/react**](../README.md)

---

[@sitecore-content-sdk/react](../README.md) / withSitecoreContext

# Function: withSitecoreContext()

> **withSitecoreContext**(`options?`): \<`ComponentProps`\>(`Component`) => (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withSitecoreContext.tsx:29](https://github.com/Sitecore/content-sdk/blob/d60a82d1a68474e16b7f78b07443588ed56138bb/packages/react/src/enhancers/withSitecoreContext.tsx#L29)

## Parameters

| Parameter  | Type                                                                        | Description |
| ---------- | --------------------------------------------------------------------------- | ----------- |
| `options?` | [`WithSitecoreContextOptions`](../interfaces/WithSitecoreContextOptions.md) |             |

## Returns

> \<`ComponentProps`\>(`Component`): (`props`) => `Element`

### Type Parameters

| Type Parameter                                                                                     |
| -------------------------------------------------------------------------------------------------- |
| `ComponentProps` _extends_ [`WithSitecoreContextProps`](../interfaces/WithSitecoreContextProps.md) |

### Parameters

| Parameter   | Type                                |
| ----------- | ----------------------------------- |
| `Component` | `ComponentType`\<`ComponentProps`\> |

### Returns

> (`props`): `Element`

#### Parameters

| Parameter | Type                                                                  |
| --------- | --------------------------------------------------------------------- |
| `props`   | [`EnhancedOmit`](../type-aliases/EnhancedOmit.md)\<`ComponentProps`\> |

#### Returns

`Element`
