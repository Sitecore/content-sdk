[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / GET\_LOCALE\_QUERY

# Variable: GET\_LOCALE\_QUERY

> `const` **GET\_LOCALE\_QUERY**: "\n  query GetLocaleById ($id: ID!) \{\n    locale(id: $id) \{\n      id\n      label\n    \}\n  \}\n"

Defined in: [packages/core/src/content/locales.ts:31](https://github.com/Sitecore/content-sdk/blob/cd9c0186a1ca632e03848e7eccc9c082c9a03341/packages/core/src/content/locales.ts#L31)

GraphQL query to retrieve a specific locale by its ID.

Variables:
- id: The ID of the locale to retrieve.
