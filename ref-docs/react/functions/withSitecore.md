[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / withSitecore

# ~~Function: withSitecore()~~

> **withSitecore**(`options?`): \<`ComponentProps`\>(`Component`) => (`props`) => `Element`

Defined in: [packages/react/src/enhancers/withSitecore.tsx:31](https://github.com/Sitecore/content-sdk/blob/21e586e21b4d02181f2ff54e45a22a203b23a8bf/packages/react/src/enhancers/withSitecore.tsx#L31)

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | `UseSitecoreOptions` | Options for whether return page context update method alongside the rest of context |

## Returns

A higher-order component that injects Sitecore context into the wrapped component.

\<`ComponentProps`\>(`Component`) => (`props`) => `Element`

## Deprecated

`useSitecore` hook is a better practice for consuming Sitecore context in components
