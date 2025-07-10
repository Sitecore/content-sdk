/**
 * Tests for dynamic pagination utilities
 */

import { expect } from 'chai';
import sinon from 'sinon';
import { ContentClient } from './content-client';
import { dynamicPagination } from './dynamic-pagination';

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
    it('should auto-detect paginated fields and return cursor-based result', async () => {
      const mockResponse = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1' }],
          cursor: 'cursor1',
          hasMore: true,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await dynamicPagination(
        mockClient,
        'query GetProducts { manyProduct { results { id name } cursor hasMore } }'
      );

      expect(result).to.deep.equal({
        items: [{ id: '1', name: 'Product 1' }],
        cursor: 'cursor1',
        hasMore: true,
      });
    });

    it('should handle single page with no more results', async () => {
      const mockResponse = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1' }],
          cursor: null,
          hasMore: false,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await dynamicPagination(
        mockClient,
        'query GetProducts { manyProduct { results { id name } cursor hasMore } }'
      );

      expect(result).to.deep.equal({
        items: [{ id: '1', name: 'Product 1' }],
        cursor: null,
        hasMore: false,
      });
    });

    it('should auto-fetch all pages when fetchAll is true', async () => {
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

      const result = await dynamicPagination(
        mockClient,
        'query GetProducts { manyProduct { results { id name } cursor hasMore } }',
        {
          fetchAll: true,
        }
      );

      expect(result).to.deep.equal({
        items: [
          { id: '1', name: 'Product 1' },
          { id: '2', name: 'Product 2' },
        ],
        cursor: null,
        hasMore: false,
      });

      expect(requestStub).to.have.been.calledTwice;
    });

    it('should respect maxPages limit when fetchAll is true', async () => {
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
          cursor: 'cursor2',
          hasMore: true,
        },
      };

      requestStub.onFirstCall().resolves(mockResponse1);
      requestStub.onSecondCall().resolves(mockResponse2);

      const result = await dynamicPagination(
        mockClient,
        'query GetProducts { manyProduct { results { id name } cursor hasMore } }',
        {
          fetchAll: true,
          maxPages: 2,
        }
      );

      expect(result).to.deep.equal({
        items: [
          { id: '1', name: 'Product 1' },
          { id: '2', name: 'Product 2' },
        ],
        cursor: 'cursor2',
        hasMore: true,
      });

      expect(requestStub).to.have.been.calledTwice;
    });

    it('should handle manual pagination with cursor', async () => {
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
        'query GetProducts { manyProduct { results { id name } cursor hasMore } }',
        {
          pagination: { after: 'cursor1' },
        }
      );

      expect(result).to.deep.equal({
        items: [{ id: '2', name: 'Product 2' }],
        cursor: null,
        hasMore: false,
      });

      expect(
        requestStub
      ).to.have.been.calledWith(
        'query GetProducts { manyProduct { results { id name } cursor hasMore } }',
        { pageSize: undefined, after: 'cursor1' }
      );
    });

    it('should throw error when no paginated fields are found', async () => {
      const mockResponse = {
        product: { id: '1', name: 'Product 1' },
      };

      requestStub.resolves(mockResponse);

      try {
        await dynamicPagination(mockClient, 'query GetProduct { product { id name } }');
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('No paginated fields found in response');
      }
    });

    it('should handle nested paginated fields', async () => {
      const mockResponse = {
        category: {
          products: {
            results: [{ id: '1', name: 'Product 1' }],
            cursor: 'cursor1',
            hasMore: false,
          },
        },
      };

      requestStub.resolves(mockResponse);

      const result = await dynamicPagination(
        mockClient,
        'query GetCategory { category { products { results { id name } cursor hasMore } } }'
      );

      expect(result).to.deep.equal({
        items: [{ id: '1', name: 'Product 1' }],
        cursor: 'cursor1',
        hasMore: false,
      });
    });

    it('should handle empty results gracefully', async () => {
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
        'query GetProducts { manyProduct { results { id name } cursor hasMore } }'
      );

      expect(result).to.deep.equal({
        items: [],
        cursor: null,
        hasMore: false,
      });
    });

    it('should handle missing pagination fields gracefully', async () => {
      const mockResponse = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1' }],
          cursor: undefined,
          hasMore: false,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await dynamicPagination(
        mockClient,
        'query GetProducts { manyProduct { results { id name } cursor hasMore } }'
      );

      expect(result).to.deep.equal({
        items: [{ id: '1', name: 'Product 1' }],
        cursor: undefined,
        hasMore: false,
      });
    });

    it('should handle multiple paginated fields (multiField) and return all results', async () => {
      const mockResponse = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1' }],
          cursor: 'cursor1',
          hasMore: true,
        },
        manyItem: {
          results: [{ id: 'A', name: 'Item A' }],
          cursor: 'cursorA',
          hasMore: false,
        },
      };

      requestStub.resolves(mockResponse);

      const result = await dynamicPagination(
        mockClient,
        'query GetData { manyProduct { results { id name } cursor hasMore } manyItem { results { id name } cursor hasMore } }',
        { multiField: true }
      );

      expect(result).to.deep.equal({
        items: [
          { id: '1', name: 'Product 1' },
          { id: 'A', name: 'Item A' },
        ],
        cursors: { manyProduct: 'cursor1', manyItem: 'cursorA' },
        hasMore: true,
      });
    });

    it('should auto-fetch all pages for multiple paginated fields (multiField + fetchAll)', async () => {
      const mockResponse1 = {
        manyProduct: {
          results: [{ id: '1', name: 'Product 1' }],
          cursor: 'cursor1',
          hasMore: true,
        },
        manyItem: {
          results: [{ id: 'A', name: 'Item A' }],
          cursor: 'cursorA',
          hasMore: true,
        },
      };
      const mockResponse2 = {
        manyProduct: {
          results: [{ id: '2', name: 'Product 2' }],
          cursor: null,
          hasMore: false,
        },
        manyItem: {
          results: [{ id: 'B', name: 'Item B' }],
          cursor: null,
          hasMore: false,
        },
      };
      requestStub.onFirstCall().resolves(mockResponse1);
      requestStub.onSecondCall().resolves(mockResponse2);

      const result = await dynamicPagination(
        mockClient,
        'query GetData { manyProduct { results { id name } cursor hasMore } manyItem { results { id name } cursor hasMore } }',
        { multiField: true, fetchAll: true }
      );

      // Type guard for MultiFieldPaginationResult
      if ('cursors' in result) {
        expect(result.items).to.deep.equal([
          { id: '1', name: 'Product 1' },
          { id: '2', name: 'Product 2' },
          { id: 'A', name: 'Item A' },
          { id: 'B', name: 'Item B' },
        ]);
        expect(result.cursors).to.deep.equal({ manyProduct: null, manyItem: null });
        expect(result.hasMore).to.equal(false);
      } else {
        expect.fail('Result is not a MultiFieldPaginationResult');
      }
    });
  });

  describe('Edge Cases', () => {
    it('should handle null response gracefully', async () => {
      requestStub.resolves(null);

      try {
        await dynamicPagination(
          mockClient,
          'query GetProducts { manyProduct { results { id name } cursor hasMore } }'
        );
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('No paginated fields found in response');
      }
    });

    it('should handle undefined response gracefully', async () => {
      requestStub.resolves(undefined);

      try {
        await dynamicPagination(
          mockClient,
          'query GetProducts { manyProduct { results { id name } cursor hasMore } }'
        );
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('No paginated fields found in response');
      }
    });

    it('should handle non-object response gracefully', async () => {
      requestStub.resolves('string response');

      try {
        await dynamicPagination(
          mockClient,
          'query GetProducts { manyProduct { results { id name } cursor hasMore } }'
        );
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect((error as Error).message).to.include('No paginated fields found in response');
      }
    });
  });
});
