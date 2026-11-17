[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / DesignLibrary

# Variable: DesignLibrary

> `const` **DesignLibrary**: () => `React.JSX.Element` \| `null`

Defined in: react/types/components/DesignLibrary/DesignLibrary.d.ts:13

Design Library component.

Renders the **real** Sitecore component for `library` / `library-metadata` modes and,
when generation is enabled (`page.mode.designLibrary.isVariantGeneration === true`),
wires the **variant generation** handshake so the parent (DL Studio) can send
generated code to preview and iterate on.

## Returns

`React.JSX.Element` \| `null`

The preview surface, or `null` when not in Design Library mode.
