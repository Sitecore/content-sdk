[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withSitecore

# ~~Function: withSitecore()~~

> **withSitecore**(`options?`): \<`ComponentProps`\>(`Component`) => (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withSitecore.tsx:31](https://github.com/Sitecore/content-sdk/blob/3bd72038ef298c1ecec751b7db43db37654b29b7/packages/react/src/enhancers/withSitecore.tsx#L31)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | `UseSitecoreOptions` | Options for whether return page context update method alongside the rest of context |

## Returns

A higher-order component that injects Sitecore context into the wrapped component.

\<`ComponentProps`\>(`Component`) => (`props`) => `Element`

## Deprecated

`useSitecore` hook is a better practice for consuming Sitecore context in components
