[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / GET\_LOCALE\_QUERY

# Variable: GET\_LOCALE\_QUERY

> `const` **GET\_LOCALE\_QUERY**: "\n  query GetLocaleById($id: ID!) \{\n    locale(id: $id) \{\n      system \{\n        id\n        label\n      \}\n    \}\n  \}\n"

Defined in: [packages/core/src/content/locales.ts:38](https://github.com/Sitecore/content-sdk/blob/b729bf4210968ad33896556213eb3325c7a4a16e/packages/core/src/content/locales.ts#L38)

GraphQL query to retrieve a specific locale by its ID.

Variables:
- id: The ID of the locale to retrieve.
