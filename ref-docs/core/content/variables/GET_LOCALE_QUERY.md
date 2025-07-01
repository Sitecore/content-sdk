[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / GET\_LOCALE\_QUERY

# Variable: GET\_LOCALE\_QUERY

> `const` **GET\_LOCALE\_QUERY**: "\n  query GetLocaleById($id: ID!) \{\n    locale(id: $id) \{\n      system \{\n        id\n        label\n      \}\n    \}\n  \}\n"

Defined in: [packages/core/src/content/locales.ts:38](https://github.com/Sitecore/content-sdk/blob/7ebeab3cd807229f59268e182358c9f141c84ddc/packages/core/src/content/locales.ts#L38)

GraphQL query to retrieve a specific locale by its ID.

Variables:
- id: The ID of the locale to retrieve.
