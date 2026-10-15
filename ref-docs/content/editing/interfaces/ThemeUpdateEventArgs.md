[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / ThemeUpdateEventArgs

# Interface: ThemeUpdateEventArgs

Defined in: [content/src/editing/theme-preview.ts:21](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/editing/theme-preview.ts#L21)

Event args for the `theme-update` event.
`message.css` is the raw CSS to inject; an empty string removes the previewed theme.

## Extends

- `DesignLibraryEvent`

## Properties

### message

> **message**: `object`

Defined in: [content/src/editing/theme-preview.ts:23](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/editing/theme-preview.ts#L23)

The message payload for the event.

#### css

> **css**: `string`

#### Overrides

`DesignLibraryEvent.message`

***

### name

> **name**: `"theme-update"`

Defined in: [content/src/editing/theme-preview.ts:22](https://github.com/Sitecore/content-sdk/blob/2ebaba6454c3e55795d63c8d38a7bfd15c6ab5ac/packages/content/src/editing/theme-preview.ts#L22)

The name of the event.

#### Overrides

`DesignLibraryEvent.name`
