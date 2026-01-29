[**@sitecore-content-sdk/content**](../../README.md)

***

[@sitecore-content-sdk/content](../../README.md) / [editing](../README.md) / DesignLibraryStatusEvent

# Interface: DesignLibraryStatusEvent

Defined in: [content/src/editing/design-library.ts:43](https://github.com/Sitecore/content-sdk/blob/a268b42996e15dfe7c883c983d1b99c91b97a726/packages/content/src/editing/design-library.ts#L43)

**`Internal`**

Represents an event indicating the status of a component in the library.

## Extends

- `DesignLibraryEvent`

## Properties

### message

> **message**: `object`

Defined in: [content/src/editing/design-library.ts:45](https://github.com/Sitecore/content-sdk/blob/a268b42996e15dfe7c883c983d1b99c91b97a726/packages/content/src/editing/design-library.ts#L45)

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

Defined in: [content/src/editing/design-library.ts:44](https://github.com/Sitecore/content-sdk/blob/a268b42996e15dfe7c883c983d1b99c91b97a726/packages/content/src/editing/design-library.ts#L44)

The name of the event.

#### Overrides

`DesignLibraryEvent.name`
