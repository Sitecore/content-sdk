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
 */
export type Locale = {
  /** The unique identifier for the locale. */
  id: string;
  /** The display name or label for the locale. */
  label: string;
};

/**
 * GraphQL query to retrieve a specific locale by its ID.
 *
 * Variables:
 * - id: The ID of the locale to retrieve.
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
 */
export const GET_LOCALES_QUERY = `
  query GetAllLocales{
    manyLocale {
      id
      label
    }
  }
`;
