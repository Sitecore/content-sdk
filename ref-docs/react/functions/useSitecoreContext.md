[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / useSitecoreContext

# Function: useSitecoreContext()

> **useSitecoreContext**(`options`?): [`WithSitecoreContextProps`](../interfaces/WithSitecoreContextProps.md)

Defined in: [packages/react/src/enhancers/withSitecoreContext.tsx:70](https://github.com/Sitecore/content-sdk/blob/bc4d59e76288877091ea87e0b1f0d7300950e831/packages/react/src/enhancers/withSitecoreContext.tsx#L70)

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
