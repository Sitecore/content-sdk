[**@sitecore-content-sdk/analytics-core**](../../../../README.md)

***

[@sitecore-content-sdk/analytics-core](../../../../README.md) / [internal](../../../README.md) / [debug](../README.md) / Debug

# Interface: Debug()

Defined in: node\_modules/@types/debug/index.d.ts:7

> **Debug**(`namespace`): [`Debugger`](Debugger.md)

Defined in: node\_modules/@types/debug/index.d.ts:8

## Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |

## Returns

[`Debugger`](Debugger.md)

## Properties

### coerce()

> **coerce**: (`val`) => `any`

Defined in: node\_modules/@types/debug/index.d.ts:9

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `val` | `any` |

#### Returns

`any`

***

### disable()

> **disable**: () => `string`

Defined in: node\_modules/@types/debug/index.d.ts:10

#### Returns

`string`

***

### enable()

> **enable**: (`namespaces`) => `void`

Defined in: node\_modules/@types/debug/index.d.ts:11

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespaces` | `string` |

#### Returns

`void`

***

### enabled()

> **enabled**: (`namespaces`) => `boolean`

Defined in: node\_modules/@types/debug/index.d.ts:12

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespaces` | `string` |

#### Returns

`boolean`

***

### formatArgs()

> **formatArgs**: (`this`, `args`) => `void`

Defined in: node\_modules/@types/debug/index.d.ts:13

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | [`Debugger`](Debugger.md) |
| `args` | `any`[] |

#### Returns

`void`

***

### formatters

> **formatters**: [`Formatters`](Formatters.md)

Defined in: node\_modules/@types/debug/index.d.ts:21

***

### humanize()

> **humanize**: \{(`value`, `options?`): `string`; (`value`): `number`; \}

Defined in: node\_modules/@types/debug/index.d.ts:16

#### Call Signature

> (`value`, `options?`): `string`

Short/Long format for `value`.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `number` |  |
| `options?` | \{ `long`: `boolean`; \} |  |
| `options.long?` | `boolean` | - |

##### Returns

`string`

#### Call Signature

> (`value`): `number`

Parse the given `value` and return milliseconds.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `value` | `StringValue` |  |

##### Returns

`number`

***

### inspectOpts?

> `optional` **inspectOpts**: `object`

Defined in: node\_modules/@types/debug/index.d.ts:23

#### colors?

> `optional` **colors**: `number` \| `boolean` \| `null`

#### depth?

> `optional` **depth**: `number` \| `boolean` \| `null`

#### hideDate?

> `optional` **hideDate**: `number` \| `boolean` \| `null`

#### showHidden?

> `optional` **showHidden**: `number` \| `boolean` \| `null`

***

### log()

> **log**: (...`args`) => `any`

Defined in: node\_modules/@types/debug/index.d.ts:14

#### Parameters

| Parameter | Type |
| ------ | ------ |
| ...`args` | `any`[] |

#### Returns

`any`

***

### names

> **names**: `RegExp`[]

Defined in: node\_modules/@types/debug/index.d.ts:18

***

### selectColor()

> **selectColor**: (`namespace`) => `string` \| `number`

Defined in: node\_modules/@types/debug/index.d.ts:15

#### Parameters

| Parameter | Type |
| ------ | ------ |
| `namespace` | `string` |

#### Returns

`string` \| `number`

***

### skips

> **skips**: `RegExp`[]

Defined in: node\_modules/@types/debug/index.d.ts:19
