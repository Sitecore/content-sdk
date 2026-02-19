[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / DesignLibraryStatusEvent

# Interface: DesignLibraryStatusEvent

Defined in: [content/src/editing/design-library.ts:41](https://github.com/Sitecore/content-sdk/blob/48c97c4b8cd547e1668c820cb220274bc3e67af1/packages/content/src/editing/design-library.ts#L41)

**`Internal`**

Represents an event indicating the status of a component in the library.

## Extends

- `DesignLibraryEvent`

## Properties

### message

> **message**: `object`

Defined in: [content/src/editing/design-library.ts:43](https://github.com/Sitecore/content-sdk/blob/48c97c4b8cd547e1668c820cb220274bc3e67af1/packages/content/src/editing/design-library.ts#L43)

The message payload for the event.

#### status

> **status**: `"rendered"` \| `"ready"`

#### uid

> **uid**: `string`

#### Overrides

`DesignLibraryEvent.message`

***

### name

> **name**: `"component:status"`

Defined in: [content/src/editing/design-library.ts:42](https://github.com/Sitecore/content-sdk/blob/48c97c4b8cd547e1668c820cb220274bc3e67af1/packages/content/src/editing/design-library.ts#L42)

The name of the event.

#### Overrides

`DesignLibraryEvent.name`
