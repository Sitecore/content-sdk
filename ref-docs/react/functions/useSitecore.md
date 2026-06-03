[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / useSitecore

# Function: useSitecore()

> **useSitecore**(`options?`): [`WithSitecoreProps`](../interfaces/WithSitecoreProps.md)

Defined in: [packages/react/src/enhancers/withSitecore.tsx:93](https://github.com/Sitecore/content-sdk/blob/3fb7faea35bc22c17643d4e6e02afd7c37bacdd3/packages/react/src/enhancers/withSitecore.tsx#L93)

This hook grants acсess to the current Sitecore page and api.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | [`WithSitecoreOptions`](../interfaces/WithSitecoreOptions.md) | hook options |

## Returns

[`WithSitecoreProps`](../interfaces/WithSitecoreProps.md)

{ api, page, updatePage }

## Examples

```ts
const EditMode = () => {
   const { page } = useSitecore();
   return <span>Edit Mode is {page.mode.isEditing ? 'active' : 'inactive'}</span>
}
```

```ts
const EditMode = () => {
   const { page, updatePage } = useSitecore({ updatable: true });
   const onClick = () => updatePage({ itemId: '123' });
   return <span onClick={onClick}>Item id is {page.itemId}</span>
}
```
