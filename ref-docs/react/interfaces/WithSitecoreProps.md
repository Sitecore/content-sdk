[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / WithSitecoreProps

# Interface: WithSitecoreProps

<<<<<<< HEAD
Defined in: [packages/react/src/enhancers/withSitecore.tsx:17](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/enhancers/withSitecore.tsx#L17)
=======
Defined in: [packages/react/src/enhancers/withSitecore.tsx:17](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/enhancers/withSitecore.tsx#L17)
>>>>>>> dd686bb50 (Update API docs)

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

<<<<<<< HEAD
Defined in: [packages/react/src/enhancers/withSitecore.tsx:25](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/enhancers/withSitecore.tsx#L25)
=======
Defined in: [packages/react/src/enhancers/withSitecore.tsx:25](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/enhancers/withSitecore.tsx#L25)
>>>>>>> dd686bb50 (Update API docs)

The API configuration defined in the `SitecoreConfig`.

***

### page

> **page**: [`Page`](../type-aliases/Page.md)

<<<<<<< HEAD
Defined in: [packages/react/src/enhancers/withSitecore.tsx:21](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/enhancers/withSitecore.tsx#L21)
=======
Defined in: [packages/react/src/enhancers/withSitecore.tsx:21](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/enhancers/withSitecore.tsx#L21)
>>>>>>> dd686bb50 (Update API docs)

The current page context.

***

### updatePage?

> `optional` **updatePage**: `false` \| (`value`) => `void`

<<<<<<< HEAD
Defined in: [packages/react/src/enhancers/withSitecore.tsx:31](https://github.com/Sitecore/content-sdk/blob/689229d984a9e94fa87b027562db80cf42927e21/packages/react/src/enhancers/withSitecore.tsx#L31)
=======
Defined in: [packages/react/src/enhancers/withSitecore.tsx:31](https://github.com/Sitecore/content-sdk/blob/d093cd1bcf7d9a0323a57fb257a3d2a6dc126908/packages/react/src/enhancers/withSitecore.tsx#L31)
>>>>>>> dd686bb50 (Update API docs)

Method to update the page. This is only available if `updatable` is set to true.

#### Param

New page value.

#### Returns
