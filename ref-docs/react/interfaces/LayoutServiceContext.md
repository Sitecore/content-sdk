[**@sitecore-content-sdk/react**](../README.md)

***

[@sitecore-content-sdk/react](../README.md) / LayoutServiceContext

# Interface: LayoutServiceContext

Defined in: packages/content/types/layout/models.d.ts:30

Shape of context data from the Sitecore Layout Service

## Indexable

> \[`key`: `string`\]: `unknown`

## Properties

### clientData?

> `optional` **clientData?**: `Record`\<`string`, `Record`\<`string`, `unknown`\>\>

Defined in: packages/content/types/layout/models.d.ts:42

***

### clientScripts?

> `optional` **clientScripts?**: `string`[]

Defined in: packages/content/types/layout/models.d.ts:41

***

### itemPath?

> `optional` **itemPath?**: `string`

Defined in: packages/content/types/layout/models.d.ts:34

***

### language?

> `optional` **language?**: `string`

Defined in: packages/content/types/layout/models.d.ts:33

***

### pageEditing?

> `optional` **pageEditing?**: `boolean`

Defined in: packages/content/types/layout/models.d.ts:32

***

### pageState?

> `optional` **pageState?**: [`LayoutServicePageState`](../enumerations/LayoutServicePageState.md)

Defined in: packages/content/types/layout/models.d.ts:35

***

### renderingType?

> `optional` **renderingType?**: `RenderingType`

Defined in: packages/content/types/layout/models.d.ts:40

***

### schemas?

> `optional` **schemas?**: `Record`\<`string`, `unknown`\>[]

Defined in: packages/content/types/layout/models.d.ts:44

JSON-LD structured data node objects (each with its own `@context`/`@type`) for the current route.

***

### site?

> `optional` **site?**: `object`

Defined in: packages/content/types/layout/models.d.ts:37

#### name?

> `optional` **name?**: `string`

***

### visitorIdentificationTimestamp?

> `optional` **visitorIdentificationTimestamp?**: `number`

Defined in: packages/content/types/layout/models.d.ts:36
