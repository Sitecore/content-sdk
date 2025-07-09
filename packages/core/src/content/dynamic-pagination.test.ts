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
  });
});
