[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / GET\_LOCALE\_QUERY

# Variable: GET\_LOCALE\_QUERY

> `const` **GET\_LOCALE\_QUERY**: "\n  query GetLocaleById($id: ID!) \{\n    locale(id: $id) \{\n      system \{\n        id\n        label\n      \}\n    \}\n  \}\n"

Defined in: [packages/core/src/content/locales.ts:38](https://github.com/Sitecore/content-sdk/blob/d1495c7bbdd615e47ac14c2a2a4b4272313631b3/packages/core/src/content/locales.ts#L38)

GraphQL query to retrieve a specific locale by its ID.

Variables:
- id: The ID of the locale to retrieve.
