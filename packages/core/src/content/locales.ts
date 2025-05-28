/**
 * Represents the "system" field in a locale response.
 */
export type SingleLocale = {
  id: string;
  label: string;
};

/**
 * Represents a locale result with a system field.
 */
export type LocaleEntry = {
  system: SingleLocale;
};

/**
 * Represents the response structure for a query that retrieves a single locale.
 */
export interface LocaleQueryResponse {
  locale: LocaleEntry | null;
}

/**
 * Represents the response structure for a query that retrieves multiple locales.
 */
export interface LocalesQueryResponse {
  manyLocale: LocaleEntry[];
}

/**
 * GraphQL query to retrieve a specific locale by its ID.
 *
 * Variables:
 * - id: The ID of the locale to retrieve.
 */
export const GET_LOCALE_QUERY = `
  query GetLocaleById($id: ID!) {
    locale(id: $id) {
      system {
        id
        label
      }
    }
  }
`;

/**
 * GraphQL query to retrieve all available locales.
 */
export const GET_LOCALES_QUERY = `
  query GetAllLocales {
    manyLocale {
      system {
        id
        label
      }
    }
  }
`;
