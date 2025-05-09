[**@sitecore-content-sdk/react**](../README.md)

---

[@sitecore-content-sdk/react](../README.md) / SitecoreContextState

# Interface: SitecoreContextState

Defined in: [packages/react/src/components/SitecoreContext.tsx:16](https://github.com/Sitecore/content-sdk/blob/d60a82d1a68474e16b7f78b07443588ed56138bb/packages/react/src/components/SitecoreContext.tsx#L16)

## Properties

### api?

> `optional` **api**: `Required`\<\{ `edge?`: `Required`\<\{ `clientContextId?`: `string`; `contextId`: `string`; `edgeUrl?`: `string`; \}\>; `local?`: `Required`\<\{ `apiHost`: `string`; `apiKey`: `string`; `path?`: `string`; \}\>; \}\>

Defined in: [packages/react/src/components/SitecoreContext.tsx:19](https://github.com/Sitecore/content-sdk/blob/d60a82d1a68474e16b7f78b07443588ed56138bb/packages/react/src/components/SitecoreContext.tsx#L19)

---

### context

> **context**: [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md)

Defined in: [packages/react/src/components/SitecoreContext.tsx:18](https://github.com/Sitecore/content-sdk/blob/d60a82d1a68474e16b7f78b07443588ed56138bb/packages/react/src/components/SitecoreContext.tsx#L18)

---

### setContext()

> **setContext**: (`value`) => `void`

Defined in: [packages/react/src/components/SitecoreContext.tsx:17](https://github.com/Sitecore/content-sdk/blob/d60a82d1a68474e16b7f78b07443588ed56138bb/packages/react/src/components/SitecoreContext.tsx#L17)

#### Parameters

| Parameter | Type                                                                                                             |
| --------- | ---------------------------------------------------------------------------------------------------------------- |
| `value`   | [`LayoutServiceData`](LayoutServiceData.md) \| [`SitecoreContextValue`](../type-aliases/SitecoreContextValue.md) |

#### Returns

`void`
