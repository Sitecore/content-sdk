[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / DesignLibraryStatusEvent

# Interface: DesignLibraryStatusEvent

Defined in: [packages/core/src/editing/design-library.ts:47](https://github.com/Sitecore/content-sdk/blob/599f6a8824eb73e29b1214dab65afe48894d64b0/packages/core/src/editing/design-library.ts#L47)

**`Internal`**

Represents an event indicating the status of a component in the library.

## Extends

- `DesignLibraryEvent`

## Properties

### message

> **message**: `object`

Defined in: [packages/core/src/editing/design-library.ts:49](https://github.com/Sitecore/content-sdk/blob/599f6a8824eb73e29b1214dab65afe48894d64b0/packages/core/src/editing/design-library.ts#L49)

The message payload for the event.

#### isRenderingServerComponent

> **isRenderingServerComponent**: `boolean`

#### status

> **status**: `"ready"` \| `"rendered"`

#### uid

> **uid**: `string`

#### Overrides

`DesignLibraryEvent.message`

***

### name

> **name**: `"component:status"`

Defined in: [packages/core/src/editing/design-library.ts:48](https://github.com/Sitecore/content-sdk/blob/599f6a8824eb73e29b1214dab65afe48894d64b0/packages/core/src/editing/design-library.ts#L48)

The name of the event.

#### Overrides

`DesignLibraryEvent.name`
