[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withSitecore

# ~~Function: withSitecore()~~

> **withSitecore**(`options?`): \<`ComponentProps`\>(`Component`) => (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withSitecore.tsx:31](https://github.com/Sitecore/content-sdk/blob/6637a5cdd65fb19a328565a2dd7accc61598d2f1/packages/react/src/enhancers/withSitecore.tsx#L31)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | `UseSitecoreOptions` | Options for whether return page context update method alongside the rest of context |

## Returns

A higher-order component that injects Sitecore context into the wrapped component.

> \<`ComponentProps`\>(`Component`): (`props`) => `Element`

### Type Parameters

| Type Parameter |
| ------ |
| `ComponentProps` *extends* `Partial`\<[`SitecoreProviderState`](../interfaces/SitecoreProviderState.md)\> & `Pick`\<[`SitecoreProviderState`](../interfaces/SitecoreProviderState.md), `"page"`\> |

### Parameters

| Parameter | Type |
| ------ | ------ |
| `Component` | `ComponentType`\<`ComponentProps`\> |

### Returns

> (`props`): `Element`

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `props` | `WithSitecoreHocProps`\<`ComponentProps`\> |

#### Returns

`Element`

## Deprecated

`useSitecore` hook is a better practice for consuming Sitecore context in components
