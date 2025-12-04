[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / WithSitecoreProps

# Interface: WithSitecoreProps

Defined in: [packages/react/src/enhancers/withSitecore.tsx:25](https://github.com/Sitecore/content-sdk/blob/e860e313e1fd16b0af1abcbc0952ae7951f74946/packages/react/src/enhancers/withSitecore.tsx#L25)

The props that HOC will inject.

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<`undefined` \| \{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<`undefined` \| \{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: [packages/react/src/enhancers/withSitecore.tsx:33](https://github.com/Sitecore/content-sdk/blob/e860e313e1fd16b0af1abcbc0952ae7951f74946/packages/react/src/enhancers/withSitecore.tsx#L33)

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

Defined in: [packages/react/src/enhancers/withSitecore.tsx:29](https://github.com/Sitecore/content-sdk/blob/e860e313e1fd16b0af1abcbc0952ae7951f74946/packages/react/src/enhancers/withSitecore.tsx#L29)

The current page context.

***

### updatePage?

> `optional` **updatePage**: `false` \| (`value`) => `void`

Defined in: [packages/react/src/enhancers/withSitecore.tsx:39](https://github.com/Sitecore/content-sdk/blob/e860e313e1fd16b0af1abcbc0952ae7951f74946/packages/react/src/enhancers/withSitecore.tsx#L39)

Method to update the page. This is only available if `updatable` is set to true.

#### Param

New page value.

#### Returns
