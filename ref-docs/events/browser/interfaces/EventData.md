[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [browser](../README.md) / EventData

# Interface: EventData

Defined in: events/src/events/custom-event/custom-event.ts:94

Interface with the required/optional attributes in order to send a custom event to SitecoreCloud API

## Extends

- `EventAttributesInput`.`NestedObject`

## Indexable

\[`key`: `string`\]: `NestedObject` \| `BasicTypes`

## Properties

### channel?

> `optional` **channel**: `string`

Defined in: events/src/events/common-interfaces.ts:9

#### Inherited from

`EventAttributesInput.channel`

***

### currency?

> `optional` **currency**: `string`

Defined in: events/src/events/common-interfaces.ts:10

#### Inherited from

`EventAttributesInput.currency`

***

### extensionData?

> `optional` **extensionData**: `NestedObject`

Defined in: events/src/events/custom-event/custom-event.ts:97

***

### language?

> `optional` **language**: `string`

Defined in: events/src/events/common-interfaces.ts:7

#### Inherited from

`EventAttributesInput.language`

***

### page?

> `optional` **page**: `string`

Defined in: events/src/events/common-interfaces.ts:8

#### Inherited from

`EventAttributesInput.page`

***

### searchData?

> `optional` **searchData**: `NestedObject`

Defined in: events/src/events/custom-event/custom-event.ts:96

***

### type

> **type**: `string`

Defined in: events/src/events/custom-event/custom-event.ts:95
