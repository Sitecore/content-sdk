[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / Identifier

# Interface: Identifier

Defined in: [events/src/events/identity/identity-event.ts:218](https://github.com/Sitecore/content-sdk/blob/95d74dcd93e25d19170d9d00899f07b66d4bacb6/packages/events/src/events/identity/identity-event.ts#L218)

The JSON array of objects that contain the identity identifiers

## Properties

### expiryDate?

> `optional` **expiryDate?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:224](https://github.com/Sitecore/content-sdk/blob/95d74dcd93e25d19170d9d00899f07b66d4bacb6/packages/events/src/events/identity/identity-event.ts#L224)

The date the unique guest (site visitor) identifier expires. This is determined by your organization's identity system.

Format: ISO 8601.

***

### id

> **id**: `string`

Defined in: [events/src/events/identity/identity-event.ts:228](https://github.com/Sitecore/content-sdk/blob/95d74dcd93e25d19170d9d00899f07b66d4bacb6/packages/events/src/events/identity/identity-event.ts#L228)

The unique guest (site visitor) identifier provided by your organization's identity system, such as a Customer Relationship Management (CRM) system.

***

### provider

> **provider**: `string`

Defined in: [events/src/events/identity/identity-event.ts:232](https://github.com/Sitecore/content-sdk/blob/95d74dcd93e25d19170d9d00899f07b66d4bacb6/packages/events/src/events/identity/identity-event.ts#L232)

The name of your organization's identity system, external to SitecoreAI, that provided the unique guest (site visitor) identifier.
