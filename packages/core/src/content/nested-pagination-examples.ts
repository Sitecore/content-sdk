/**
 * Comprehensive examples demonstrating nested pagination scenarios
 * This file shows how to handle different pagination patterns in Content Services
 */

import { ContentClient } from './content-client';
import { paginateAllWithNested } from './pagination';

// Example 1: Simple First-Level Pagination (like dummy-many 3.ts)
export async function exampleFirstLevelPagination() {
  const client = ContentClient.createClient();

  console.log('=== Example 1: First-Level Pagination ===');

  // This is straightforward - paginate through taxonomies only
  const allTaxonomies = await client.getAllTaxonomies({ pageSize: 10 });
  console.log(`Fetched ${allTaxonomies.length} taxonomies`);

  // Each taxonomy has terms, but they're not fully paginated
  allTaxonomies.forEach((taxonomy, idx) => {
    console.log(`Taxonomy ${idx + 1}: ${taxonomy.system.label} (${taxonomy.terms.length} terms)`);
  });
}

// Example 2: Nested Pagination (like dummy-single 3.ts but for all taxonomies)
export async function exampleNestedPagination() {
  const client = ContentClient.createClient();

  console.log('\n=== Example 2: Nested Pagination ===');

  // This is complex - paginate through taxonomies AND their terms
  const allTaxonomiesWithTerms = await client.getAllTaxonomiesWithAllTerms({
    pageSize: 5, // 5 taxonomies per page
    nested: { pageSize: 20 }, // 20 terms per page
  });

  console.log(`Fetched ${allTaxonomiesWithTerms.length} taxonomies with all their terms`);

  allTaxonomiesWithTerms.forEach((taxonomy, idx) => {
    console.log(
      `Taxonomy ${idx + 1}: ${taxonomy.system.label} (${taxonomy.nestedItems.length} terms)`
    );
  });
}

// Example 3: Conditional Nested Pagination
export async function exampleConditionalNestedPagination() {
  const client = ContentClient.createClient();

  console.log('\n=== Example 3: Conditional Nested Pagination ===');

  // Only fetch terms for taxonomies that have more than 5 terms in the initial response
  const taxonomiesWithConditionalTerms = await client.getAllTaxonomiesWithConditionalTerms({
    pagination: { pageSize: 10 },
    shouldFetchTerms: (taxonomy) => taxonomy.terms.results.length > 5,
  });

  console.log(`Fetched ${taxonomiesWithConditionalTerms.length} taxonomies with conditional terms`);

  taxonomiesWithConditionalTerms.forEach((taxonomy, idx) => {
    if (taxonomy.nestedItems) {
      console.log(
        `Taxonomy ${idx + 1}: ${taxonomy.system.label} (${
          taxonomy.nestedItems.length
        } terms - fetched)`
      );
    } else {
      console.log(
        `Taxonomy ${idx + 1}: ${taxonomy.system.label} (terms not fetched - condition not met)`
      );
    }
  });
}

// Example 4: Custom Nested Pagination with Dynamic Endpoints
export async function exampleCustomNestedPagination() {
  const client = ContentClient.createClient();

  console.log('\n=== Example 4: Custom Nested Pagination ===');

  // Example: Fetch all categories and their products
  const fetchCategories = async (args: any) => {
    // This would be a real GraphQL query for categories
    const response = (await client.get(
      `
      query GetCategories($pageSize: Int, $after: String) {
        manyCategory(minimumPageSize: $pageSize, after: $after) {
          results { id name }
          cursor hasMore
        }
      }
    `,
      { pageSize: args.pageSize, after: args.after }
    )) as any;
    return response.manyCategory;
  };

  const fetchProductsForCategory = async (category: any) => {
    // This would be a real GraphQL query for products in a category
    const response = (await client.get(
      `
      query GetProductsInCategory($categoryId: ID!, $pageSize: Int, $after: String) {
        manyProduct(categoryId: $categoryId, minimumPageSize: $pageSize, after: $after) {
          results { id name price }
          cursor hasMore
        }
      }
    `,
      { categoryId: category.id, pageSize: 50, after: '' }
    )) as any;
    return response.manyProduct;
  };

  const categoriesWithProducts = await paginateAllWithNested(
    fetchCategories,
    fetchProductsForCategory,
    { pageSize: 10, nested: { pageSize: 50 } }
  );

  console.log(`Fetched ${categoriesWithProducts.length} categories with their products`);
}

// Example 5: Performance-Optimized Nested Pagination
export async function examplePerformanceOptimizedPagination() {
  const client = ContentClient.createClient();

  console.log('\n=== Example 5: Performance-Optimized Pagination ===');

  // Strategy: Fetch taxonomies in small batches, but only get terms for the first few
  const taxonomiesWithLimitedTerms = await client.getAllTaxonomiesWithConditionalTerms({
    pagination: { pageSize: 5, maxPages: 2 }, // Only first 2 pages of taxonomies
    shouldFetchTerms: (taxonomy: any) => taxonomy.terms.results.length > 5, // Only taxonomies with more than 5 terms get full terms
  });

  console.log(
    `Fetched ${taxonomiesWithLimitedTerms.length} taxonomies with optimized term fetching`
  );

  taxonomiesWithLimitedTerms.forEach((taxonomy, idx) => {
    if (taxonomy.nestedItems) {
      console.log(
        `Taxonomy ${idx + 1}: ${taxonomy.system.label} (${
          taxonomy.nestedItems.length
        } terms - full fetch)`
      );
    } else {
      console.log(
        `Taxonomy ${idx + 1}: ${taxonomy.system.label} (terms not fetched - optimization)`
      );
    }
  });
}

// Example 6: Error Handling in Nested Pagination
export async function exampleErrorHandlingPagination() {
  const client = ContentClient.createClient();

  console.log('\n=== Example 6: Error Handling in Nested Pagination ===');

  try {
    const taxonomiesWithTerms = await client.getAllTaxonomiesWithAllTerms({
      pageSize: 10,
      nested: { pageSize: 20 },
    });

    console.log(`Successfully fetched ${taxonomiesWithTerms.length} taxonomies`);

    // Check for any taxonomies that failed to load terms
    const failedTaxonomies = taxonomiesWithTerms.filter((t) => t.nestedItems.length === 0);
    if (failedTaxonomies.length > 0) {
      console.log(`Warning: ${failedTaxonomies.length} taxonomies have no terms (possible errors)`);
    }
  } catch (error) {
    console.error('Error in nested pagination:', error);
  }
}

// Main function to run all examples
export async function runAllNestedPaginationExamples() {
  try {
    await exampleFirstLevelPagination();
    await exampleNestedPagination();
    await exampleConditionalNestedPagination();
    await exampleCustomNestedPagination();
    await examplePerformanceOptimizedPagination();
    await exampleErrorHandlingPagination();

    console.log('\n=== All Examples Completed Successfully ===');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Usage patterns for different scenarios
export const NestedPaginationPatterns = {
  /**
   * Pattern 1: Simple First-Level Pagination
   * Use when you only need to paginate through the main collection
   * Best for: Basic list views, simple data fetching
   */
  simple: `
    const allItems = await client.getAllTaxonomies({ pageSize: 50 });
  `,

  /**
   * Pattern 2: Full Nested Pagination
   * Use when you need ALL nested items for ALL parent items
   * Best for: Data exports, complete data synchronization
   */
  fullNested: `
    const allWithNested = await client.getAllTaxonomiesWithAllTerms({
      pageSize: 10,
      nested: { pageSize: 50 }
    });
  `,

  /**
   * Pattern 3: Conditional Nested Pagination
   * Use when you only need nested items for specific parent items
   * Best for: Performance optimization, selective data loading
   */
  conditional: `
    const conditional = await client.getAllTaxonomiesWithConditionalTerms({
      pagination: { pageSize: 20 },
      shouldFetchTerms: (taxonomy) => taxonomy.terms.results.length > 10
    });
  `,

  /**
   * Pattern 4: Custom Nested Pagination
   * Use when you need custom logic for nested pagination
   * Best for: Complex business logic, custom data relationships
   */
  custom: `
    const custom = await paginateAllWithNested(
      fetchParents,
      fetchNestedItems,
      { pageSize: 10, nested: { pageSize: 25 } }
    );
  `,
};
