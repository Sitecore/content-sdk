/**
 * Represents the locale entity.
 */
export type Locale = {
  /** The unique identifier of the locale. */
  id: string;
  /** The label of the locale. */
  label: string;
};

/**
 * A locale item included in a locale query response.
 */
export type LocaleItem = {
  system: Locale;
};

/**
 * Represents the response structure for a query that retrieves a single locale.
 */
export interface LocaleQueryResponse {
  locale: LocaleItem | null;
}

/**
 * Represents the response structure for a query that retrieves multiple locales.
 */
export interface LocalesQueryResponse {
  manyLocale: {
    results: LocaleItem[];
    cursor?: string;
    hasMore: boolean;
  };
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
  query GetAllLocales($pageSize: Int, $after: String) {
    manyLocale(minimumPageSize: $pageSize, after: $after) {
      system {
        id
        label
      }
      cursor
      hasMore
    }
  }
`;
