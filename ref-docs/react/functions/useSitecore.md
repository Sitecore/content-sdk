[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / useSitecore

# Function: useSitecore()

> **useSitecore**(`options?`): [`SitecoreProviderState`](../interfaces/SitecoreProviderState.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:146](https://github.com/Sitecore/content-sdk/blob/4c907d5f6aac9870a7c40fd993f1f70ddce4802f/packages/react/src/components/SitecoreProvider.tsx#L146)

This hook grants acсess to the current Sitecore page and api.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | `UseSitecoreOptions` | hook options |

## Returns

[`SitecoreProviderState`](../interfaces/SitecoreProviderState.md)

The current Sitecore context, including the page and api.

## Example

```ts
const EditMode = () => {
   const { page } = useSitecore();
   return <span>Edit Mode is {page.mode.isEditing ? 'active' : 'inactive'}</span>
}
```
