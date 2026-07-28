[**@sitecore-content-sdk/events**](../../README.md)

***

[@sitecore-content-sdk/events](../../README.md) / [index](../README.md) / Identifier

# Interface: Identifier

Defined in: [events/src/events/identity/identity-event.ts:217](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/events/src/events/identity/identity-event.ts#L217)

The JSON array of objects that contain the identity identifiers

## Properties

### expiryDate?

> `optional` **expiryDate?**: `string`

Defined in: [events/src/events/identity/identity-event.ts:223](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/events/src/events/identity/identity-event.ts#L223)

The date the unique guest (site visitor) identifier expires. This is determined by your organization's identity system.

Format: ISO 8601.

***

### id

> **id**: `string`

Defined in: [events/src/events/identity/identity-event.ts:227](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/events/src/events/identity/identity-event.ts#L227)

The unique guest (site visitor) identifier provided by your organization's identity system, such as a Customer Relationship Management (CRM) system.

***

### provider

> **provider**: `string`

Defined in: [events/src/events/identity/identity-event.ts:231](https://github.com/Sitecore/content-sdk/blob/6563736fb3fdcd5885f88fcfe20c15d0800efbd7/packages/events/src/events/identity/identity-event.ts#L231)

The name of your organization's identity system, external to SitecoreAI, that provided the unique guest (site visitor) identifier.
