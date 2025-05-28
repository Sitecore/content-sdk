/**
 * Represents a term within a taxonomy.
 */
export type Term = {
  /** The unique identifier of the term. */
  id: string;
  /** The internal name of the term. */
  name: string;
  /** The display label of the term. */
  label: string;
};

/**
 * Represents a list of terms within a taxonomy.
 * In getTaxonomies, terms are always returned as a full list (no pagination).
 * In getTaxonomy, terms may be paginated.
 */
export interface TermList {
  /** The list of terms in the current (or full) page. */
  results: Term[];
  /** The cursor to fetch the next page of terms, if available. (Used only in getTaxonomy) */
  cursor?: string | null;
  /** Indicates whether more terms are available after the current page. (Used only in getTaxonomy) */
  hasMore: boolean;
}

/**
 * Represents the system metadata of a taxonomy.
 */
export type TaxonomySystem = {
  /** The unique identifier of the taxonomy. */
  id: string;
  /** The internal name of the taxonomy. */
  name: string;
  /** The version of the taxonomy. */
  version: number;
  /** The display label of the taxonomy. */
  label: string;
  /** The timestamp when the taxonomy was created (ISO 8601 format). */
  createdAt: string;
  /** The user ID who created the taxonomy. */
  createdBy: string;
  /** The timestamp when the taxonomy was last updated (ISO 8601 format). */
  updatedAt: string;
  /** The user ID who last updated the taxonomy. */
  updatedBy: string;
  /** The publish status of the taxonomy (e.g., PREVIEW, PUBLISHED). */
  publishStatus: string;
};

/**
 * Represents a taxonomy with its associated terms.
 * Terms are paginated only in single-taxonomy queries (getTaxonomy).
 */
export type Taxonomy = {
  /** The list of terms within the taxonomy. */
  terms: TermList;
  /** The system metadata of the taxonomy. */
  system: TaxonomySystem;
};

/**
 * Represents the response structure for a query that retrieves a specific taxonomy by ID.
 */
export interface TaxonomyQueryResponse {
  /** The retrieved taxonomy. */
  taxonomy: {
    /** The system metadata of the taxonomy. */
    system: TaxonomySystem;
    /** The terms for the taxonomy (may be paginated). */
    terms: {
      results: Term[];
      cursor?: string | null;
      hasMore: boolean;
    };
  };
}

/**
 * Represents the response structure for a query that retrieves multiple taxonomies.
 */
export interface TaxonomiesQueryResponse {
  /** The list of retrieved taxonomies, with pagination metadata. */
  manyTaxonomy: {
    /** The list of taxonomies in the current page. */
    results: {
      /** The terms associated with the taxonomy (always the full list, not paginated). */
      terms: {
        results: Term[];
        cursor?: string | null;
        hasMore: boolean;
      };
      /** The system metadata of the taxonomy. */
      system: TaxonomySystem;
    }[];
    /** The cursor for fetching the next page of taxonomies, if available. */
    cursor?: string;
    /** Indicates whether more taxonomies are available after the current page. */
    hasMore: boolean;
  };
}

/**
 * Represents a paginated list of content items (generic for various types, e.g., Taxonomy).
 * Note: This type does not include any stateful fetchNext/fetchMore helpers. Pagination is stateless.
 */
export interface ContentItemList<T> {
  /** The list of content items in the current page. */
  results: T[];
  /** The cursor for fetching the next page of items, if available. */
  cursor?: string;
  /** Indicates whether more items are available after the current page. */
  hasMore: boolean;
}

// --- GraphQL queries ---

/**
 * GraphQL query to retrieve all taxonomies with optional pagination for taxonomies only.
 *
 * Variables:
 * - pageSize: The number of taxonomies to retrieve per page.
 * - after: The cursor for fetching the next page of taxonomies.
 */
export const GET_TAXONOMIES_QUERY = `
  query GetAllTaxonomies(
    $pageSize: Int
    $after: String
  ) {
    manyTaxonomy(minimumPageSize: $pageSize, after: $after) {
      cursor
      hasMore
      results {
        terms {
          cursor
          hasMore
          results {
            id
            name
            label
          }
        }
        system {
          id
          name
          version
          label
          createdAt
          createdBy
          updatedAt
          updatedBy
          publishStatus
        }
      }
    }
  }
`;

/**
 * GraphQL query to retrieve a specific taxonomy by its ID, with optional pagination for its terms.
 *
 * Variables:
 * - id: The unique ID of the taxonomy to retrieve.
 * - termsPageSize: The number of terms to retrieve per page.
 * - termsAfter: The cursor for fetching the next page of terms.
 */
export const GET_TAXONOMY_QUERY = `
  query GetTaxonomyById($id: ID!, $termsPageSize: Int, $termsAfter: String) {
    taxonomy(id: $id) {
      terms(minimumPageSize: $termsPageSize, after: $termsAfter) {
        cursor
        hasMore
        results {
          id
          name
          label
        }
      }
      system {
        id
        name
        version
        label
        createdAt
        createdBy
        updatedAt
        updatedBy
        publishStatus
      }
    }
  }
`;
