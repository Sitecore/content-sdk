[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / DesignLibraryStatusEvent

# Interface: DesignLibraryStatusEvent

Defined in: [content/src/editing/design-library.ts:47](https://github.com/Sitecore/content-sdk/blob/500ff39a667bc697e65ad8db118ac8c76a24bf2b/packages/content/src/editing/design-library.ts#L47)

**`Internal`**

Represents an event indicating the status of a component in the library.

## Extends

- `DesignLibraryEvent`

## Properties

### message

> **message**: `object`

Defined in: [content/src/editing/design-library.ts:49](https://github.com/Sitecore/content-sdk/blob/500ff39a667bc697e65ad8db118ac8c76a24bf2b/packages/content/src/editing/design-library.ts#L49)

The message payload for the event.

#### isRenderingServerComponent

> **isRenderingServerComponent**: `boolean`

#### status

> **status**: `"rendered"` \| `"ready"`

#### uid

> **uid**: `string`

#### Overrides

`DesignLibraryEvent.message`

***

### name

> **name**: `"component:status"`

Defined in: [content/src/editing/design-library.ts:48](https://github.com/Sitecore/content-sdk/blob/500ff39a667bc697e65ad8db118ac8c76a24bf2b/packages/content/src/editing/design-library.ts#L48)

The name of the event.

#### Overrides

`DesignLibraryEvent.name`
