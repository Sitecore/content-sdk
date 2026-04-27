[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / DesignLibraryStatusEvent

# Interface: DesignLibraryStatusEvent

Defined in: [content/src/editing/design-library.ts:49](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/content/src/editing/design-library.ts#L49)

**`Internal`**

Represents an event indicating the status of a component in the library.

## Extends

- `DesignLibraryEvent`

## Properties

### message

> **message**: `object`

Defined in: [content/src/editing/design-library.ts:51](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/content/src/editing/design-library.ts#L51)

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

Defined in: [content/src/editing/design-library.ts:50](https://github.com/Sitecore/content-sdk/blob/0140eb8495d867c5549ce1cfd9ff09e0ee4c0166/packages/content/src/editing/design-library.ts#L50)

The name of the event.

#### Overrides

`DesignLibraryEvent.name`
