[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / useSitecore

# Function: useSitecore()

> **useSitecore**(`options?`): [`WithSitecoreProps`](../interfaces/WithSitecoreProps.md)

Defined in: [packages/react/src/enhancers/withSitecore.tsx:84](https://github.com/Sitecore/content-sdk/blob/1895b0f9c2d1368b07383f85311d808a73aac7bd/packages/react/src/enhancers/withSitecore.tsx#L84)

This hook grants acсess to the current Sitecore page context and api.
by default Content SDK includes the following properties in this context:
- pageEditing - Provided by Layout Service, a boolean indicating whether the route is being accessed via the Sitecore Editor.
- pageState - Like pageEditing, but a string: normal, preview or edit.
- site - Provided by Layout Service, an object containing the name of the current Sitecore site context.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`WithSitecoreOptions`](../interfaces/WithSitecoreOptions.md) | hook options |

## Returns

[`WithSitecoreProps`](../interfaces/WithSitecoreProps.md)

{ api, pageContext, updateContext }

## Examples

```ts
const EditMode = () => {
   const { pageContext } = useSitecore();
   return <span>Edit Mode is {pageContext.pageEditing ? 'active' : 'inactive'}</span>
}
```

```ts
const EditMode = () => {
   const { pageContext, updateContext } = useSitecore({ updatable: true });
   const onClick = () => updateContext({ pageEditing: true });
   return <span onClick={onClick}>Edit Mode is {pageContext.pageEditing ? 'active' : 'inactive'}</span>
}
```
