[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibrary

# Function: DesignLibrary()

> **DesignLibrary**(): `Element` \| `null`

Defined in: [packages/react/src/components/DesignLibrary/DesignLibrary.tsx:53](https://github.com/Sitecore/content-sdk/blob/48c97c4b8cd547e1668c820cb220274bc3e67af1/packages/react/src/components/DesignLibrary/DesignLibrary.tsx#L53)

Design Library component.

Renders the **real** Sitecore component for `library` / `library-metadata` modes and,
when generation is enabled (`page.mode.designLibrary.isVariantGeneration === true`),
wires the **variant generation** handshake so the parent (DL Studio) can send
generated code to preview and iterate on.

## Returns

`Element` \| `null`

The preview surface, or `null` when not in Design Library mode.
