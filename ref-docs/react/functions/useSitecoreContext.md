[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / useSitecoreContext

# Function: useSitecoreContext()

> **useSitecoreContext**(`options`?): `object`

Defined in: [packages/react/src/enhancers/withSitecoreContext.tsx:65](https://github.com/Sitecore/xmc-jss-dev/blob/0ec01b23b6deeac59e8196222f94c2a9866d7b4b/packages/react/src/enhancers/withSitecoreContext.tsx#L65)

This hook grants acсess to the current Sitecore page context
by default JSS includes the following properties in this context:
- pageEditing - Provided by Layout Service, a boolean indicating whether the route is being accessed via the Sitecore Editor.
- pageState - Like pageEditing, but a string: normal, preview or edit.
- site - Provided by Layout Service, an object containing the name of the current Sitecore site context.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options`? | [`WithSitecoreContextOptions`](../interfaces/WithSitecoreContextOptions.md) | hook options |

## Returns

`object`

{ sitecoreContext, updateSitecoreContext }

### sitecoreContext

> **sitecoreContext**: [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md) = `reactContext.context`

### updateSitecoreContext()

> **updateSitecoreContext**: (`value`) => `void`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `value` | [`LayoutServiceData`](../interfaces/LayoutServiceData.md) \| [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md) |

#### Returns

`void`

## See

https://jss.sitecore.com/docs/techniques/extending-layout-service/layoutservice-extending-context

## Examples

```ts
const EditMode = () => {
   const { sitecoreContext } = useSitecoreContext();
   return <span>Edit Mode is {sitecoreContext.pageEditing ? 'active' : 'inactive'}</span>
}
```

```ts
const EditMode = () => {
   const { sitecoreContext, updateSitecoreContext } = useSitecoreContext({ updatable: true });
   const onClick = () => updateSitecoreContext({ pageEditing: true });
   return <span onClick={onClick}>Edit Mode is {sitecoreContext.pageEditing ? 'active' : 'inactive'}</span>
}
```
