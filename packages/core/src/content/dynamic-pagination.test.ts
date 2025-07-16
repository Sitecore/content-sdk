/*
 * Tests for dynamic pagination utility
 */

import { expect } from 'chai';
import sinon from 'sinon';
import { ContentClient } from './content-client';
import { dynamicPagination, DynamicPaginationResult } from './dynamic-pagination';

describe('Dynamic Pagination', () => {
  let mockClient: ContentClient;
  let requestStub: sinon.SinonStub;

  beforeEach(() => {
    mockClient = ({
      get: sinon.stub(),
    } as unknown) as ContentClient;
    requestStub = mockClient.get as sinon.SinonStub;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('dynamicPagination', () => {
    it('should handle basic manyProduct pagination', async () => {
      const mockResponse = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1', price: 100 }],
          cursor: 'cursor1',
          hasMore: true,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await dynamicPagination(
        mockClient,
        `query GetProducts($pageSize: Int, $after: String) {
          manyProduct(minimumPageSize: $pageSize, after: $after) {
            results { id name price }
            cursor hasMore
          }
        }`,
        { pageSize: 50 }
      );

      expect(result).to.deep.equal({
        items: [{ id: '1', name: 'Product 1', price: 100 }],
        cursor: 'cursor1',
        hasMore: true,
      });

      expect(requestStub).to.have.been.calledWith(
        `query GetProducts($pageSize: Int, $after: String) {
          manyProduct(minimumPageSize: $pageSize, after: $after) {
            results { id name price }
            cursor hasMore
          }
        }`,
        { pageSize: 50 }
      );
    });

    it('should handle manyItem pagination', async () => {
      const mockResponse = {
        manyItem: {
          results: [{ id: 'item1', name: 'Item 1' }],
          cursor: 'cursor2',
          hasMore: false,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await dynamicPagination(
        mockClient,
        `query GetItems($pageSize: Int, $after: String) {
          manyItem(minimumPageSize: $pageSize, after: $after) {
            results { id name }
            cursor hasMore
          }
        }`,
        { pageSize: 25 }
      );

      expect(result).to.deep.equal({
        items: [{ id: 'item1', name: 'Item 1' }],
        cursor: 'cursor2',
        hasMore: false,
      });
    });

    it('should handle pagination with cursor', async () => {
      const mockResponse = {
        manyProduct: {
          results: [{ id: '2', name: 'Product 2' }],
          cursor: null,
          hasMore: false,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await dynamicPagination(
        mockClient,
        `query GetProducts($pageSize: Int, $after: String) {
          manyProduct(minimumPageSize: $pageSize, after: $after) {
            results { id name }
            cursor hasMore
          }
        }`,
        { pageSize: 50, after: 'cursor1' }
      );

      expect(result).to.deep.equal({
        items: [{ id: '2', name: 'Product 2' }],
        cursor: null,
        hasMore: false,
      });

      expect(requestStub).to.have.been.calledWith(
        `query GetProducts($pageSize: Int, $after: String) {
          manyProduct(minimumPageSize: $pageSize, after: $after) {
            results { id name }
            cursor hasMore
          }
        }`,
        { pageSize: 50, after: 'cursor1' }
      );
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

      const result = await dynamicPagination(
        mockClient,
        `query GetProducts($pageSize: Int, $after: String) {
          manyProduct(minimumPageSize: $pageSize, after: $after) {
            results { id name }
            cursor hasMore
          }
        }`,
        { pageSize: 50 }
      );

      expect(result).to.deep.equal({
        items: [],
        cursor: null,
        hasMore: false,
      });
    });

    it('should handle missing cursor and hasMore fields', async () => {
      const mockResponse = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1' }],
        },
      };

      requestStub.resolves(mockResponse);

      const result = await dynamicPagination(
        mockClient,
        `query GetProducts($pageSize: Int, $after: String) {
          manyProduct(minimumPageSize: $pageSize, after: $after) {
            results { id name }
          }
        }`,
        { pageSize: 50 }
      );

      expect(result).to.deep.equal({
        items: [{ id: '1', name: 'Product 1' }],
        cursor: undefined,
        hasMore: undefined,
      });
    });

    it('should handle null cursor and hasMore values', async () => {
      const mockResponse = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1' }],
          cursor: null,
          hasMore: null,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await dynamicPagination(
        mockClient,
        `query GetProducts($pageSize: Int, $after: String) {
          manyProduct(minimumPageSize: $pageSize, after: $after) {
            results { id name }
            cursor hasMore
          }
        }`,
        { pageSize: 50 }
      );

      expect(result).to.deep.equal({
        items: [{ id: '1', name: 'Product 1' }],
        cursor: null,
        hasMore: null,
      });
    });

    it('should throw error when no paginated field is found', async () => {
      const mockResponse = {
        product: { id: '1', name: 'Product 1' },
      };

      requestStub.resolves(mockResponse);

      try {
        await dynamicPagination(mockClient, 'query GetProduct { product { id name } }', {
          pageSize: 50,
        });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include(
          'No paginated field found in response. Ensure your query includes a field with results, cursor, and hasMore.'
        );
      }
    });

    it('should throw error when response is null', async () => {
      requestStub.resolves(null);

      try {
        await dynamicPagination(
          mockClient,
          'query GetProducts { manyProduct { results { id } cursor hasMore } }',
          { pageSize: 50 }
        );
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include(
          'No paginated field found in response. Ensure your query includes a field with results, cursor, and hasMore.'
        );
      }
    });

    it('should handle getTaxonomies endpoint', async () => {
      const mockResponse = {
        getTaxonomies: {
          results: [
            { id: 'tax1', name: 'Taxonomy 1' },
            { id: 'tax2', name: 'Taxonomy 2' },
          ],
          cursor: 'tax_cursor',
          hasMore: true,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await dynamicPagination(
        mockClient,
        `query GetTaxonomies($pageSize: Int, $after: String) {
          getTaxonomies(minimumPageSize: $pageSize, after: $after) {
            results { id name }
            cursor hasMore
          }
        }`,
        { pageSize: 10 }
      );

      expect(result).to.deep.equal({
        items: [
          { id: 'tax1', name: 'Taxonomy 1' },
          { id: 'tax2', name: 'Taxonomy 2' },
        ],
        cursor: 'tax_cursor',
        hasMore: true,
      });
    });

    it('should handle non-array results gracefully', async () => {
      const mockResponse = {
        manyProduct: {
          results: 'not an array',
          cursor: 'cursor1',
          hasMore: true,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await dynamicPagination(
        mockClient,
        `query GetProducts($pageSize: Int, $after: String) {
          manyProduct(minimumPageSize: $pageSize, after: $after) {
            results { id name }
            cursor hasMore
          }
        }`,
        { pageSize: 50 }
      );

      expect(result).to.deep.equal({
        items: [],
        cursor: 'cursor1',
        hasMore: true,
      });
    });

    it('should propagate client errors', async () => {
      const clientError = new Error('Network error');
      requestStub.rejects(clientError);

      try {
        await dynamicPagination(
          mockClient,
          'query GetProducts { manyProduct { results { id } cursor hasMore } }',
          { pageSize: 50 }
        );
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('Dynamic pagination failed: Network error');
      }
    });
  });

  describe('Type safety', () => {
    it('should provide proper typing for generic results', async () => {
      const mockResponse = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1', price: 100 }],
          cursor: 'cursor1',
          hasMore: true,
        },
      };

      requestStub.resolves(mockResponse);

      interface Product {
        id: string;
        name: string;
        price: number;
      }

      const result: DynamicPaginationResult<Product> = await dynamicPagination<Product>(
        mockClient,
        `query GetProducts($pageSize: Int, $after: String) {
          manyProduct(minimumPageSize: $pageSize, after: $after) {
            results { id name price }
            cursor hasMore
          }
        }`,
        { pageSize: 50 }
      );

      expect(result.items[0].price).to.equal(100);
      expect(result.items[0].name).to.equal('Product 1');
    });
  });
});
