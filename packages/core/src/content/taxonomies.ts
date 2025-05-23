/**
 * Represents a taxonomy term.
 */
export type TaxonomyTerm = {
  /** The ID of the taxonomy term. */
  id: string;
  /** The name of the term. */
  name: string;
  /** A human readable description for the term. */
  label?: string;
};

/**
 * Represents a list of taxonomy terms.
 */
export type TaxonomyTermList = {
  /** The cursor for the term. */
  cursor: string | null;
  /** Indicates if there are more terms to fetch. */
  hasMore: boolean;
  /** The list of terms. */
  results: TaxonomyTerm[];
};

/**
 * Represents system fields of a taxonomy.
 */
export type TaxonomySystem = {
  id: string;
  name: string;
  version: number;
  label: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  publishStatus: string;
};

/**
 * Represents a taxonomy.
 */
export type Taxonomy = {
  /** The terms of the taxonomy. */
  terms: TaxonomyTermList;
  /** The system fields of the taxonomy. */
  system: TaxonomySystem;
};

/**
 * Represents the response structure for a query that retrieves a single taxonomy.
 */
export interface TaxonomyQueryResponse {
  taxonomy: Taxonomy | null;
}

/**
 * Represents the response structure for a query that retrieves multiple taxonomies.
 */
export interface TaxonomiesQueryResponse {
  manyTaxonomy: {
    results: Taxonomy[];
  };
}

/**
 * GraphQL query to retrieve a specific taxonomy by its ID.
 *
 * Variables:
 * - id: The ID of the taxonomy to retrieve.
 */
export const GET_TAXONOMY_QUERY = `
  query GetTaxonomyById($id: ID!) {
    taxonomy(id: $id) {
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
`;

/**
 * GraphQL query to retrieve all available taxonomies.
 */
export const GET_TAXONOMIES_QUERY = `query GetAllTaxonomies {
  manyTaxonomy {
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
}`;
