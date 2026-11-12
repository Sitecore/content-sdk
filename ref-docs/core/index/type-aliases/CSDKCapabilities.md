[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [index](../README.md) / CSDKCapabilities

# Type Alias: CSDKCapabilities

> **CSDKCapabilities** = `object`

Defined in: [packages/core/src/capabilities.ts:71](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/capabilities.ts#L71)

Contract containing every capability packages may export.

## Properties

### abTesting?

> `optional` **abTesting?**: [`CapabilityDefinition`](CapabilityDefinition.md)

Defined in: [packages/core/src/capabilities.ts:82](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/capabilities.ts#L82)

Allows setting up and displaying personalization-based A/B tests.

***

### byocRender?

> `optional` **byocRender?**: [`CapabilityDefinition`](CapabilityDefinition.md)

Defined in: [packages/core/src/capabilities.ts:84](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/capabilities.ts#L84)

Allows rendering BYOC components.

***

### designLibrary?

> `optional` **designLibrary?**: [`CapabilityDefinition`](CapabilityDefinition.md) & `object`

Defined in: [packages/core/src/capabilities.ts:91](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/capabilities.ts#L91)

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

Defined in: [packages/core/src/capabilities.ts:80](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/capabilities.ts#L80)

Allows item editing through the editing render endpoint.

***

### feaasRender?

> `optional` **feaasRender?**: [`CapabilityDefinition`](CapabilityDefinition.md)

Defined in: [packages/core/src/capabilities.ts:86](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/capabilities.ts#L86)

Allows rendering FEaaS components.

***

### preview?

> `optional` **preview?**: [`CapabilityDefinition`](CapabilityDefinition.md) & `object`

Defined in: [packages/core/src/capabilities.ts:73](https://github.com/Sitecore/content-sdk/blob/a6f2fa837d94ddfacbf5ffaa348ac01f0737da82/packages/core/src/capabilities.ts#L73)

Allows item preview through the editing render endpoint.

#### Type Declaration

##### value

> **value**: `object`

###### value.timeBasedPreview?

> `optional` **timeBasedPreview?**: [`CapabilityDefinition`](CapabilityDefinition.md)

Allows preview for a specific point in time through the editing render endpoint.
