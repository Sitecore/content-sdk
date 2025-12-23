[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / DesignLibraryStatusEvent

# Interface: DesignLibraryStatusEvent

Defined in: [packages/core/src/editing/design-library.ts:41](https://github.com/Sitecore/content-sdk/blob/4ac6c0b08031d0f8d3e3046612ef022854196c98/packages/core/src/editing/design-library.ts#L41)

**`Internal`**

Represents an event indicating the status of a component in the library.

## Extends

- `DesignLibraryEvent`

## Properties

### message

> **message**: `object`

Defined in: [packages/core/src/editing/design-library.ts:43](https://github.com/Sitecore/content-sdk/blob/4ac6c0b08031d0f8d3e3046612ef022854196c98/packages/core/src/editing/design-library.ts#L43)

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

Defined in: [packages/core/src/editing/design-library.ts:42](https://github.com/Sitecore/content-sdk/blob/4ac6c0b08031d0f8d3e3046612ef022854196c98/packages/core/src/editing/design-library.ts#L42)

The name of the event.

#### Overrides

`DesignLibraryEvent.name`
