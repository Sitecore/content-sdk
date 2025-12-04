[**@sitecore-content-sdk/nextjs**](../../README.md)

***

[@sitecore-content-sdk/nextjs](../../README.md) / [index](../README.md) / LayoutServiceContext

# Interface: LayoutServiceContext

Defined in: core/types/layout/models.d.ts:30

Shape of context data from the Sitecore Layout Service

## Indexable

\[`key`: `string`\]: `unknown`

## Properties

### clientData?

> `optional` **clientData**: `Record`\<`string`, `Record`\<`string`, `unknown`\>\>

Defined in: core/types/layout/models.d.ts:42

***

### clientScripts?

> `optional` **clientScripts**: `string`[]

Defined in: core/types/layout/models.d.ts:41

***

### itemPath?

> `optional` **itemPath**: `string`

Defined in: core/types/layout/models.d.ts:34

***

### language?

> `optional` **language**: `string`

Defined in: core/types/layout/models.d.ts:33

***

### pageEditing?

> `optional` **pageEditing**: `boolean`

Defined in: core/types/layout/models.d.ts:32

***

### pageState?

> `optional` **pageState**: [`LayoutServicePageState`](../enumerations/LayoutServicePageState.md)

Defined in: core/types/layout/models.d.ts:35

***

### renderingType?

> `optional` **renderingType**: [`Component`](../enumerations/RenderingType.md#component)

Defined in: core/types/layout/models.d.ts:40

***

### site?

> `optional` **site**: `object`

Defined in: core/types/layout/models.d.ts:37

#### name?

> `optional` **name**: `string`

***

### visitorIdentificationTimestamp?

> `optional` **visitorIdentificationTimestamp**: `number`

Defined in: core/types/layout/models.d.ts:36
