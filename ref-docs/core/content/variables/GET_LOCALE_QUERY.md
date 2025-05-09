[**@sitecore-content-sdk/core**](../../README.md)

---

[@sitecore-content-sdk/core](../../README.md) / [content](../README.md) / GET_LOCALE_QUERY

# Variable: GET_LOCALE_QUERY

> `const` **GET_LOCALE_QUERY**: "\n query GetLocaleById ($id: ID!) \{\n    locale(id: $id) \{\n id\n label\n \}\n \}\n"

Defined in: [packages/core/src/content/locales.ts:31](https://github.com/Sitecore/content-sdk/blob/d60a82d1a68474e16b7f78b07443588ed56138bb/packages/core/src/content/locales.ts#L31)

GraphQL query to retrieve a specific locale by its ID.

Variables:

- id: The ID of the locale to retrieve.
