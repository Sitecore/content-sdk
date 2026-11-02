[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CSDKCapabilities

# Type Alias: CSDKCapabilities

> **CSDKCapabilities** = `object`

Defined in: [packages/core/src/capabilities.ts:61](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/core/src/capabilities.ts#L61)

Contract containing every capability packages may export.

## Properties

### abTesting?

> `optional` **abTesting?**: [`CapabilityDefinition`](CapabilityDefinition.md)

Defined in: [packages/core/src/capabilities.ts:72](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/core/src/capabilities.ts#L72)

Allows setting up and displaying personalization-based A/B tests.

***

### byocRender?

> `optional` **byocRender?**: [`CapabilityDefinition`](CapabilityDefinition.md)

Defined in: [packages/core/src/capabilities.ts:74](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/core/src/capabilities.ts#L74)

Allows rendering BYOC components.

***

### designLibrary?

> `optional` **designLibrary?**: [`CapabilityDefinition`](CapabilityDefinition.md) & `object`

Defined in: [packages/core/src/capabilities.ts:81](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/core/src/capabilities.ts#L81)

Allows Design Studio to render components dynamically.
Sub-capabilities are optional because each package exports only the ones it provides.

#### Type Declaration

##### value

> **value**: `object`

###### value.aiComponentExport?

> `optional` **aiComponentExport?**: [`CapabilityDefinition`](CapabilityDefinition.md)

Allows the CLI to create a generated component in the local filesystem.

###### value.variantGeneration?

> `optional` **variantGeneration?**: [`CapabilityDefinition`](CapabilityDefinition.md)

Allows AI-based code generation and component generation.

###### value.variantPreview?

> `optional` **variantPreview?**: [`CapabilityDefinition`](CapabilityDefinition.md)

Allows previewing AI-generated components.

***

### editing?

> `optional` **editing?**: [`CapabilityDefinition`](CapabilityDefinition.md)

Defined in: [packages/core/src/capabilities.ts:70](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/core/src/capabilities.ts#L70)

Allows item editing through the editing render endpoint.

***

### feaasRender?

> `optional` **feaasRender?**: [`CapabilityDefinition`](CapabilityDefinition.md)

Defined in: [packages/core/src/capabilities.ts:76](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/core/src/capabilities.ts#L76)

Allows rendering FEaaS components.

***

### preview?

> `optional` **preview?**: [`CapabilityDefinition`](CapabilityDefinition.md) & `object`

Defined in: [packages/core/src/capabilities.ts:63](https://github.com/Sitecore/content-sdk/blob/e2bacaf0f5c83b2db3fd8f4245136fda44d91dad/packages/core/src/capabilities.ts#L63)

Allows item preview through the editing render endpoint.

#### Type Declaration

##### value

> **value**: `object`

###### value.timeBasedPreview?

> `optional` **timeBasedPreview?**: [`CapabilityDefinition`](CapabilityDefinition.md)

Allows preview for a specific point in time through the editing render endpoint.
