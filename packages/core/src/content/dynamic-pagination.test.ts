import { expect } from 'chai';
import sinon from 'sinon';
import { ContentClient } from './content-client';
import { executeDynamicPagination, simpleDynamicPagination } from './dynamic-pagination';

describe('Dynamic Pagination', () => {
  let client: ContentClient;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    client = new ContentClient({
      tenant: 'test-tenant',
      environment: 'test-env',
      token: 'test-token',
    });

    // Mock the GraphQL client to avoid endpoint validation
    client.graphqlClient = {
      request: sinon.stub(),
    } as any;

    requestStub = sinon.stub(client, 'get');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('executeDynamicPagination', () => {
    it('should paginate through a simple query', async () => {
      const mockResponse1 = {
        manyProduct: {
          results: [
            { id: '1', name: 'Product 1' },
            { id: '2', name: 'Product 2' },
          ],
          cursor: 'cursor1',
          hasMore: true,
        },
      };

      const mockResponse2 = {
        manyProduct: {
          results: [{ id: '3', name: 'Product 3' }],
          cursor: null,
          hasMore: false,
        },
      };

      requestStub.onFirstCall().resolves(mockResponse1);
      requestStub.onSecondCall().resolves(mockResponse2);

      const result = await executeDynamicPagination(client, {
        query: `
          query GetProducts($pageSize: Int, $after: String) {
            manyProduct(minimumPageSize: $pageSize, after: $after) {
              results { id name }
              cursor hasMore
            }
          }
        `,
        paginatedFieldPath: 'manyProduct',
        pagination: { pageSize: 2 },
      });

      expect(result.items).to.have.length(3);
      expect(result.totalPages).to.equal(2);
      expect(result.totalItems).to.equal(3);
      expect(result.hasMore).to.be.false;
      expect(result.metadata.apiCalls).to.equal(2);
      expect(result.metadata.errors).to.have.length(0);
      expect(result.metadata.duration).to.be.a('number');
      expect(result.metadata.duration).to.be.greaterThan(0);
      expect(result.metadata.duration).to.be.a('number');
      expect(result.metadata.duration).to.be.greaterThan(0);
    });

    it('should handle single page responses', async () => {
      const mockResponse = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1' }],
          cursor: null,
          hasMore: false,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await executeDynamicPagination(client, {
        query: `
          query GetProducts($pageSize: Int, $after: String) {
            manyProduct(minimumPageSize: $pageSize, after: $after) {
              results { id name }
              cursor hasMore
            }
          }
        `,
        paginatedFieldPath: 'manyProduct',
      });

      expect(result.items).to.have.length(1);
      expect(result.totalPages).to.equal(1);
      expect(result.hasMore).to.be.false;
      expect(result.metadata.apiCalls).to.equal(1);
      expect(result.metadata.duration).to.be.a('number');
    });

    it('should handle empty results', async () => {
      const mockResponse = {
        manyProduct: {
          results: [],
          cursor: null,
          hasMore: false,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await executeDynamicPagination(client, {
        query: `
          query GetProducts($pageSize: Int, $after: String) {
            manyProduct(minimumPageSize: $pageSize, after: $after) {
              results { id name }
              cursor hasMore
            }
          }
        `,
        paginatedFieldPath: 'manyProduct',
      });

      expect(result.items).to.have.length(0);
      expect(result.totalPages).to.equal(1);
      expect(result.totalItems).to.equal(0);
      expect(result.hasMore).to.be.false;
      expect(result.metadata.apiCalls).to.equal(1);
    });

    it('should handle null results field', async () => {
      const mockResponse = {
        manyProduct: {
          results: null,
          cursor: null,
          hasMore: false,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await executeDynamicPagination(client, {
        query: `
          query GetProducts($pageSize: Int, $after: String) {
            manyProduct(minimumPageSize: $pageSize, after: $after) {
              results { id name }
              cursor hasMore
            }
          }
        `,
        paginatedFieldPath: 'manyProduct',
      });

      expect(result.items).to.have.length(0);
      expect(result.totalPages).to.equal(1);
      expect(result.hasMore).to.be.false;
    });

    it('should handle missing paginated field', async () => {
      const mockResponse = {
        // Missing manyProduct field
      };

      requestStub.resolves(mockResponse);

      try {
        await executeDynamicPagination(client, {
          query: `
            query GetProducts($pageSize: Int, $after: String) {
              manyProduct(minimumPageSize: $pageSize, after: $after) {
                results { id name }
                cursor hasMore
              }
            }
          `,
          paginatedFieldPath: 'manyProduct',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('Dynamic pagination failed');
      }
    });

    it('should respect maxPages option', async () => {
      const mockResponse = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1' }],
          cursor: 'cursor1',
          hasMore: true,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await executeDynamicPagination(client, {
        query: `
          query GetProducts($pageSize: Int, $after: String) {
            manyProduct(minimumPageSize: $pageSize, after: $after) {
              results { id name }
              cursor hasMore
            }
          }
        `,
        paginatedFieldPath: 'manyProduct',
        pagination: { maxPages: 1 },
      });

      expect(result.items).to.have.length(1);
      expect(result.totalPages).to.equal(1);
      expect(result.hasMore).to.be.true; // Still has more, but we stopped due to maxPages
    });

    it('should handle errors gracefully', async () => {
      requestStub.rejects(new Error('API Error'));

      try {
        await executeDynamicPagination(client, {
          query: `
            query GetProducts($pageSize: Int, $after: String) {
              manyProduct(minimumPageSize: $pageSize, after: $after) {
                results { id name }
                cursor hasMore
              }
            }
          `,
          paginatedFieldPath: 'manyProduct',
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('Dynamic pagination failed');
      }
    });

    it('should work with type generics', async () => {
      interface CustomProduct {
        id: string;
        name: string;
        price: number;
      }

      const mockResponse = {
        manyProduct: {
          results: [
            { id: '1', name: 'Product 1', price: 100 },
            { id: '2', name: 'Product 2', price: 200 },
          ],
          cursor: null,
          hasMore: false,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await executeDynamicPagination<CustomProduct>(client, {
        query: `
          query GetProducts($pageSize: Int, $after: String) {
            manyProduct(minimumPageSize: $pageSize, after: $after) {
              results { id name price }
              cursor hasMore
            }
          }
        `,
        paginatedFieldPath: 'manyProduct',
      });

      expect(result.items).to.have.length(2);
      expect(result.items[0]).to.have.property('price', 100);
      expect(result.items[1]).to.have.property('price', 200);
    });

    it('should handle nested pagination', async () => {
      // Mock responses for parent categories
      const categoryResponse1 = {
        manyCategory: {
          results: [
            { id: 'cat1', name: 'Category 1' },
            { id: 'cat2', name: 'Category 2' },
          ],
          cursor: null,
          hasMore: false,
        },
      };

      // Mock responses for nested products in each category
      const productsResponse1 = {
        taxonomy: {
          terms: {
            results: [
              { id: 'prod1', name: 'Product 1' },
              { id: 'prod2', name: 'Product 2' },
            ],
            cursor: null,
            hasMore: false,
          },
        },
      };

      const productsResponse2 = {
        taxonomy: {
          terms: {
            results: [{ id: 'prod3', name: 'Product 3' }],
            cursor: null,
            hasMore: false,
          },
        },
      };

      requestStub.onFirstCall().resolves(categoryResponse1);
      requestStub.onSecondCall().resolves(productsResponse1);
      requestStub.onThirdCall().resolves(productsResponse2);

      const result = await executeDynamicPagination(client, {
        query: `
          query GetCategories($pageSize: Int, $after: String) {
            manyCategory(minimumPageSize: $pageSize, after: $after) {
              results { id name }
              cursor hasMore
            }
          }
        `,
        paginatedFieldPath: 'manyCategory',
        nested: {
          fieldPath: 'allTerms',
          getParentId: (category) => category.id,
          nestedQuery: `
            query GetTaxonomyTerms($taxonomyId: ID!, $pageSize: Int, $after: String) {
              taxonomy(id: $taxonomyId) {
                terms(minimumPageSize: $pageSize, after: $after) {
                  results { id name }
                  cursor hasMore
                }
              }
            }
          `,
          nestedFieldPath: 'taxonomy.terms',
          nestedVariables: (taxonomyId, args) => ({ taxonomyId, ...args }),
          pagination: { pageSize: 10 },
        },
      });

      expect(result.items).to.have.length(2);
      expect(result.items[0]).to.have.property('allTerms');
      expect(result.items[0].allTerms).to.have.length(2);
      expect(result.items[1]).to.have.property('allTerms');
      expect(result.items[1].allTerms).to.have.length(1);
      expect(result.metadata.apiCalls).to.equal(3); // 1 for categories + 2 for nested products
    });

    it('should handle nested pagination with empty results', async () => {
      const categoryResponse = {
        manyCategory: {
          results: [{ id: 'cat1', name: 'Category 1' }],
          cursor: null,
          hasMore: false,
        },
      };

      const emptyProductsResponse = {
        taxonomy: {
          terms: {
            results: [],
            cursor: null,
            hasMore: false,
          },
        },
      };

      requestStub.onFirstCall().resolves(categoryResponse);
      requestStub.onSecondCall().resolves(emptyProductsResponse);

      const result = await executeDynamicPagination(client, {
        query: `
          query GetCategories($pageSize: Int, $after: String) {
            manyCategory(minimumPageSize: $pageSize, after: $after) {
              results { id name }
              cursor hasMore
            }
          }
        `,
        paginatedFieldPath: 'manyCategory',
        nested: {
          fieldPath: 'allTerms',
          getParentId: (category) => category.id,
          nestedQuery: `
            query GetTaxonomyTerms($taxonomyId: ID!, $pageSize: Int, $after: String) {
              taxonomy(id: $taxonomyId) {
                terms(minimumPageSize: $pageSize, after: $after) {
                  results { id name }
                  cursor hasMore
                }
              }
            }
          `,
          nestedFieldPath: 'taxonomy.terms',
          nestedVariables: (taxonomyId, args) => ({ taxonomyId, ...args }),
        },
      });

      expect(result.items).to.have.length(1);
      expect(result.items[0]).to.have.property('allTerms');
      expect(result.items[0].allTerms).to.have.length(0);
    });

    it('should handle nested pagination with errors', async () => {
      const categoryResponse = {
        manyCategory: {
          results: [{ id: 'cat1', name: 'Category 1' }],
          cursor: null,
          hasMore: false,
        },
      };

      requestStub.onFirstCall().resolves(categoryResponse);
      requestStub.onSecondCall().rejects(new Error('Nested API Error'));

      const result = await executeDynamicPagination(client, {
        query: `
          query GetCategories($pageSize: Int, $after: String) {
            manyCategory(minimumPageSize: $pageSize, after: $after) {
              results { id name }
              cursor hasMore
            }
          }
        `,
        paginatedFieldPath: 'manyCategory',
        nested: {
          fieldPath: 'allTerms',
          getParentId: (category) => category.id,
          nestedQuery: `
            query GetTaxonomyTerms($taxonomyId: ID!, $pageSize: Int, $after: String) {
              taxonomy(id: $taxonomyId) {
                terms(minimumPageSize: $pageSize, after: $after) {
                  results { id name }
                  cursor hasMore
                }
              }
            }
          `,
          nestedFieldPath: 'taxonomy.terms',
          nestedVariables: (taxonomyId, args) => ({ taxonomyId, ...args }),
        },
      });

      expect(result.items).to.have.length(1);
      expect(result.metadata.errors).to.have.length(1);
      expect(result.metadata.errors[0]).to.include('Nested API Error');
    });
  });

  describe('simpleDynamicPagination', () => {
    it('should return just the items array', async () => {
      const mockResponse = {
        manyProduct: {
          results: [
            { id: '1', name: 'Product 1' },
            { id: '2', name: 'Product 2' },
          ],
          cursor: null,
          hasMore: false,
        },
      };

      requestStub.resolves(mockResponse);

      const items = await simpleDynamicPagination(
        client,
        `
          query GetProducts($pageSize: Int, $after: String) {
            manyProduct(minimumPageSize: $pageSize, after: $after) {
              results { id name }
              cursor hasMore
            }
          }
        `,
        'manyProduct',
        { pageSize: 10 }
      );

      expect(items).to.have.length(2);
      expect(items[0]).to.deep.equal({ id: '1', name: 'Product 1' });
      expect(items[1]).to.deep.equal({ id: '2', name: 'Product 2' });
    });

    it('should handle empty results', async () => {
      const mockResponse = {
        manyProduct: {
          results: [],
          cursor: null,
          hasMore: false,
        },
      };

      requestStub.resolves(mockResponse);

      const items = await simpleDynamicPagination(
        client,
        `
          query GetProducts($pageSize: Int, $after: String) {
            manyProduct(minimumPageSize: $pageSize, after: $after) {
              results { id name }
              cursor hasMore
            }
          }
        `,
        'manyProduct'
      );

      expect(items).to.have.length(0);
    });

    it('should handle multi-page results', async () => {
      const mockResponse1 = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1' }],
          cursor: 'cursor1',
          hasMore: true,
        },
      };

      const mockResponse2 = {
        manyProduct: {
          results: [{ id: '2', name: 'Product 2' }],
          cursor: null,
          hasMore: false,
        },
      };

      requestStub.onFirstCall().resolves(mockResponse1);
      requestStub.onSecondCall().resolves(mockResponse2);

      const items = await simpleDynamicPagination(
        client,
        `
          query GetProducts($pageSize: Int, $after: String) {
            manyProduct(minimumPageSize: $pageSize, after: $after) {
              results { id name }
              cursor hasMore
            }
          }
        `,
        'manyProduct'
      );

      expect(items).to.have.length(2);
      expect(items[0]).to.deep.equal({ id: '1', name: 'Product 1' });
      expect(items[1]).to.deep.equal({ id: '2', name: 'Product 2' });
    });

    it('should respect maxPages option', async () => {
      const mockResponse = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1' }],
          cursor: 'cursor1',
          hasMore: true,
        },
      };

      requestStub.resolves(mockResponse);

      const items = await simpleDynamicPagination(
        client,
        `
          query GetProducts($pageSize: Int, $after: String) {
            manyProduct(minimumPageSize: $pageSize, after: $after) {
              results { id name }
              cursor hasMore
            }
          }
        `,
        'manyProduct',
        { maxPages: 1 }
      );

      expect(items).to.have.length(1);
    });
  });
});
