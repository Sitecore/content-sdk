[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / DesignLibraryStatusEvent

# Interface: DesignLibraryStatusEvent

Defined in: [content/src/editing/design-library.ts:43](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/content/src/editing/design-library.ts#L43)

**`Internal`**

Represents an event indicating the status of a component in the library.

## Extends

- `DesignLibraryEvent`

## Properties

### message

> **message**: `object`

Defined in: [content/src/editing/design-library.ts:45](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/content/src/editing/design-library.ts#L45)

The message payload for the event.

#### status

> **status**: `"ready"` \| `"rendered"`

#### uid

> **uid**: `string`

#### Overrides

`DesignLibraryEvent.message`

***

### name

> **name**: `"component:status"`

Defined in: [content/src/editing/design-library.ts:44](https://github.com/Sitecore/content-sdk/blob/74365d5c2afd18a1fb476338fa7e4ac44617886c/packages/content/src/editing/design-library.ts#L44)

The name of the event.

#### Overrides

`DesignLibraryEvent.name`
