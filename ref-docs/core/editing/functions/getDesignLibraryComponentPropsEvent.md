[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [editing](../README.md) / getDesignLibraryComponentPropsEvent

# Function: getDesignLibraryComponentPropsEvent()

> **getDesignLibraryComponentPropsEvent**(`uid`, `fields`, `parameters`): [`DesignLibraryComponentPropsEvent`](../interfaces/DesignLibraryComponentPropsEvent.md)

Defined in: [packages/core/src/editing/design-library.ts:254](https://github.com/Sitecore/content-sdk/blob/e4805e77c88af2a512e70d508c3004ebc275812a/packages/core/src/editing/design-library.ts#L254)

Generates a DesignLibraryComponentPropsEvent with the given uid, fields and parameters.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `uid` | `string` | The unique identifier for the event. |
| `fields` | [`ComponentFields`](../../layout/interfaces/ComponentFields.md) | The fields of the component. |
| `parameters` | [`ComponentParams`](../../layout/interfaces/ComponentParams.md) | The parameters of the component. |

## Returns

[`DesignLibraryComponentPropsEvent`](../interfaces/DesignLibraryComponentPropsEvent.md)

An object representing the DesignLibraryComponentPropsEvent.
