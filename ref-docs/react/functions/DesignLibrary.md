[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / DesignLibrary

# Function: DesignLibrary()

> **DesignLibrary**(): `Element` \| `null`

Defined in: [packages/react/src/components/DesignLibrary/DesignLibrary.tsx:50](https://github.com/Sitecore/content-sdk/blob/f559a5f32d3b72c553bf5e9a3870c6af89ad15ac/packages/react/src/components/DesignLibrary/DesignLibrary.tsx#L50)

Design Library component.

Renders the **real** Sitecore component for `library` / `library-metadata` modes and,
when generation is enabled (`page.mode.designLibrary.isVariantGeneration === true`),
wires the **variant generation** handshake so the parent (DL Studio) can send
generated code to preview and iterate on.

## Returns

`Element` \| `null`

The preview surface, or `null` when not in Design Library mode.
