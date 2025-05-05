[**@sitecore-content-sdk/core**](../../README.md)

***

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / GET\_LOCALE\_QUERY

# Variable: GET\_LOCALE\_QUERY

> `const` **GET\_LOCALE\_QUERY**: "\n  query GetLocaleById ($id: ID!) \{\n    locale(id: $id) \{\n      id\n      label\n    \}\n  \}\n"

Defined in: [packages/core/src/content/locales.ts:31](https://github.com/Sitecore/content-sdk/blob/d77d1405286fef707263e879400fbc0f6f058aeb/packages/core/src/content/locales.ts#L31)

GraphQL query to retrieve a specific locale by its ID.

Variables:
- id: The ID of the locale to retrieve.
