[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / useSitecore

# Function: useSitecore()

> **useSitecore**(`options?`): [`SitecoreProviderState`](../interfaces/SitecoreProviderState.md)

Defined in: [packages/react/src/components/SitecoreProvider.tsx:175](https://github.com/Sitecore/content-sdk/blob/958b502d1704bb305d7d8f1373f43324336459f6/packages/react/src/components/SitecoreProvider.tsx#L175)

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
