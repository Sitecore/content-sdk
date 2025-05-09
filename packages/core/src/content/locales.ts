/**
 * Represents the response structure for a query that retrieves a locale.
 */
export interface LocaleQueryResponse {
  locale: Locale | null;
}

/**
 * Represents the response structure for a query that retrieves multiple locales.
 */
export interface LocalesQueryResponse {
  manyLocale: Locale[];
}

/**
 * Represents a locale with an id and a label.
 * @typedef Locale
 * @property {string} id - The unique identifier for the locale.
 * @property {string} label - The display name or label for the locale.
 */
export type Locale = {
  id: string;
  label: string;
};

/**
 * GraphQL query to retrieve a specific locale by its ID.
 *
 * @param {string} id - The unique identifier for the locale.
 * @returns {string} The GraphQL query string.
 */
export const GET_LOCALE_QUERY = `
  query GetLocaleById ($id: ID!) {
    locale(id: $id) {
      id
      label
    }
  }
`;

/**
 * GraphQL query to retrieve all available locales.
 *
 * @returns {string} The GraphQL query string.
 */
export const GET_LOCALES_QUERY = `
  query GetAllLocales{
    manyLocale {
      id
      label
    }
  }
`;
