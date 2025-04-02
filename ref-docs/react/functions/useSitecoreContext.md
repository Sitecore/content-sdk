[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / useSitecoreContext

# Function: useSitecoreContext()

> **useSitecoreContext**(`options`?): [`WithSitecoreContextProps`](../interfaces/WithSitecoreContextProps.md)

Defined in: [packages/react/src/enhancers/withSitecoreContext.tsx:71](https://github.com/Sitecore/xmc-jss-dev/blob/2d716c1b15bc7f650cb9eb490f393fec3b1f4809/packages/react/src/enhancers/withSitecoreContext.tsx#L71)

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

[`WithSitecoreContextProps`](../interfaces/WithSitecoreContextProps.md)

{ sitecoreContext, updateSitecoreContext }

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
