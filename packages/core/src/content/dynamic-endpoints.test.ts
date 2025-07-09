import { expect } from 'chai';
import sinon from 'sinon';
import { ContentClient } from './content-client';
import { paginateAll } from './pagination';
import {
  StoreItem,
  Category,
  Product,
  ManyStoreItemResponse,
  ManyCategoryResponse,
  ManyProductResponse,
  generateMockStoreItems,
  generateMockCategories,
  generateMockProducts,
} from './dynamic-endpoints';

describe('Dynamic Endpoint Integration', () => {
  let mockGraphQLClient: sinon.SinonStubbedInstance<any>;
  let contentClient: ContentClient;

  beforeEach(() => {
    mockGraphQLClient = {
      request: sinon.stub(),
    };

    // Create a ContentClient with mock options
    contentClient = new ContentClient({
      tenant: 'test-tenant',
      environment: 'test-env',
      token: 'test-token',
    });

    // Replace the graphqlClient with our mock to avoid endpoint validation
    contentClient.graphqlClient = mockGraphQLClient;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('Store Items Pagination', () => {
    it('should paginate through all store items', async () => {
      // Mock data for 3 pages of store items
      const page1Items = generateMockStoreItems(10);
      const page2Items = generateMockStoreItems(10);
      const page3Items = generateMockStoreItems(5);

      mockGraphQLClient.request
        .onFirstCall()
        .resolves({
          manyStoreItem: {
            results: page1Items,
            cursor: 'cursor1',
            hasMore: true,
          },
        })
        .onSecondCall()
        .resolves({
          manyStoreItem: {
            results: page2Items,
            cursor: 'cursor2',
            hasMore: true,
          },
        })
        .onThirdCall()
        .resolves({
          manyStoreItem: {
            results: page3Items,
            cursor: 'cursor3',
            hasMore: false,
          },
        });

      const fetchStoreItems = async (args: any): Promise<any> => {
        const response = await contentClient.get(
          `
          query GetManyStoreItem($pageSize: Int, $after: String) {
            manyStoreItem(minimumPageSize: 10, after: $after) {
              results {
                system { id name }
                price category description inStock images
              }
              cursor hasMore
            }
          }
        `,
          { pageSize: 10, after: args.after }
        );
        return (response as any).manyStoreItem;
      };

      const allStoreItems = await paginateAll<StoreItem>(fetchStoreItems, { pageSize: 10 });

      expect(allStoreItems).to.have.length(25);
      expect(mockGraphQLClient.request).to.have.been.calledThrice;
    });

    it('should handle store items with custom page size', async () => {
      const page1Items = generateMockStoreItems(5);
      const page2Items = generateMockStoreItems(3);

      mockGraphQLClient.request
        .onFirstCall()
        .resolves({
          manyStoreItem: {
            results: page1Items,
            cursor: 'cursor1',
            hasMore: true,
          },
        })
        .onSecondCall()
        .resolves({
          manyStoreItem: {
            results: page2Items,
            cursor: 'cursor2',
            hasMore: false,
          },
        });

      const fetchStoreItems = async (args: any): Promise<any> => {
        const response = await contentClient.get('', {
          query: `
            query GetManyStoreItem($pageSize: Int, $after: String) {
              manyStoreItem(minimumPageSize: $pageSize, after: $after) {
                results {
                  system { id name }
                  price category description inStock images
                }
                cursor hasMore
              }
            }
          `,
          variables: { pageSize: 5, after: args.after },
        });
        return (response as any).manyStoreItem;
      };

      const allStoreItems = await paginateAll<StoreItem>(fetchStoreItems, { pageSize: 5 });

      expect(allStoreItems).to.have.length(8);
      expect(mockGraphQLClient.request).to.have.been.calledTwice;
    });
  });

  describe('Categories Pagination', () => {
    it('should paginate through all categories', async () => {
      const page1Categories = generateMockCategories(8);
      const page2Categories = generateMockCategories(6);

      mockGraphQLClient.request
        .onFirstCall()
        .resolves({
          manyCategory: {
            results: page1Categories,
            cursor: 'cursor1',
            hasMore: true,
          },
        })
        .onSecondCall()
        .resolves({
          manyCategory: {
            results: page2Categories,
            cursor: 'cursor2',
            hasMore: false,
          },
        });

      const fetchCategories = async (args: any): Promise<any> => {
        const response = await contentClient.get('', {
          query: `
            query GetManyCategory($pageSize: Int, $after: String) {
              manyCategory(minimumPageSize: $pageSize, after: $after) {
                results {
                  system { id name }
                  name description parentCategory
                }
                cursor hasMore
              }
            }
          `,
          variables: { pageSize: 8, after: args.after },
        });
        return (response as any).manyCategory;
      };

      const allCategories = await paginateAll<Category>(fetchCategories, { pageSize: 8 });

      expect(allCategories).to.have.length(14);
      expect(mockGraphQLClient.request).to.have.been.calledTwice;
    });

    it('should handle categories with max pages limit', async () => {
      const page1Categories = generateMockCategories(10);
      const page2Categories = generateMockCategories(10);

      mockGraphQLClient.request
        .onFirstCall()
        .resolves({
          manyCategory: {
            results: page1Categories,
            cursor: 'cursor1',
            hasMore: true,
          },
        })
        .onSecondCall()
        .resolves({
          manyCategory: {
            results: page2Categories,
            cursor: 'cursor2',
            hasMore: true,
          },
        });

      const fetchCategories = async (args: any): Promise<any> => {
        const response = await contentClient.get('', {
          query: `
            query GetManyCategory($pageSize: Int, $after: String) {
              manyCategory(minimumPageSize: $pageSize, after: $after) {
                results {
                  system { id name }
                  name description parentCategory
                }
                cursor hasMore
              }
            }
          `,
          variables: { pageSize: 10, after: args.after },
        });
        return (response as any).manyCategory;
      };

      const allCategories = await paginateAll<Category>(fetchCategories, {
        pageSize: 10,
        maxPages: 2,
      });

      expect(allCategories).to.have.length(20);
      expect(mockGraphQLClient.request).to.have.been.calledTwice;
    });
  });

  describe('Products Pagination', () => {
    it('should paginate through all products', async () => {
      const page1Products = generateMockProducts(15);
      const page2Products = generateMockProducts(15);
      const page3Products = generateMockProducts(7);

      mockGraphQLClient.request
        .onFirstCall()
        .resolves({
          manyProduct: {
            results: page1Products,
            cursor: 'cursor1',
            hasMore: true,
          },
        })
        .onSecondCall()
        .resolves({
          manyProduct: {
            results: page2Products,
            cursor: 'cursor2',
            hasMore: true,
          },
        })
        .onThirdCall()
        .resolves({
          manyProduct: {
            results: page3Products,
            cursor: 'cursor3',
            hasMore: false,
          },
        });

      const fetchProducts = async (args: any): Promise<any> => {
        const response = await contentClient.get('', {
          query: `
            query GetManyProduct($pageSize: Int, $after: String) {
              manyProduct(minimumPageSize: $pageSize, after: $after) {
                results {
                  system { id name }
                  name sku price category description specifications
                }
                cursor hasMore
              }
            }
          `,
          variables: { pageSize: 15, after: args.after },
        });
        return (response as any).manyProduct;
      };

      const allProducts = await paginateAll<Product>(fetchProducts, { pageSize: 15 });

      expect(allProducts).to.have.length(37);
      expect(mockGraphQLClient.request).to.have.been.calledThrice;
    });

    it('should handle products with single page response', async () => {
      const products = generateMockProducts(12);

      mockGraphQLClient.request.resolves({
        manyProduct: {
          results: products,
          cursor: 'cursor1',
          hasMore: false,
        },
      });

      const fetchProducts = async (args: any): Promise<any> => {
        const response = await contentClient.get('', {
          query: `
            query GetManyProduct($pageSize: Int, $after: String) {
              manyProduct(minimumPageSize: $pageSize, after: $after) {
                results {
                  system { id name }
                  name sku price category description specifications
                }
                cursor hasMore
              }
            }
          `,
          variables: { pageSize: 20, after: args.after },
        });
        return (response as any).manyProduct;
      };

      const allProducts = await paginateAll<Product>(fetchProducts, { pageSize: 20 });

      expect(allProducts).to.have.length(12);
      expect(mockGraphQLClient.request).to.have.been.calledOnce;
    });
  });

  describe('Error Handling', () => {
    it('should handle GraphQL errors gracefully', async () => {
      mockGraphQLClient.request.rejects(new Error('GraphQL Error'));

      const fetchStoreItems = async (args: any): Promise<any> => {
        const response = await contentClient.get('', {
          query: `
            query GetManyStoreItem($pageSize: Int, $after: String) {
              manyStoreItem(minimumPageSize: $pageSize, after: $after) {
                results {
                  system { id name }
                  price category description inStock images
                }
                cursor hasMore
              }
            }
          `,
          variables: { pageSize: 10, after: args.after },
        });
        return (response as any).manyStoreItem;
      };

      try {
        await paginateAll<StoreItem>(fetchStoreItems, { pageSize: 10 });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.include('GraphQL Error');
      }
    });

    it('should handle invalid response structure', async () => {
      mockGraphQLClient.request.resolves({
        manyStoreItem: {
          results: null,
          cursor: 'cursor1',
          hasMore: true,
        },
      });

      const fetchStoreItems = async (args: any): Promise<any> => {
        const response = await contentClient.get('', {
          query: `
            query GetManyStoreItem($pageSize: Int, $after: String) {
              manyStoreItem(minimumPageSize: $pageSize, after: $after) {
                results {
                  system { id name }
                  price category description inStock images
                }
                cursor hasMore
              }
            }
          `,
          variables: { pageSize: 10, after: args.after },
        });
        return (response as any).manyStoreItem;
      };

      try {
        await paginateAll<StoreItem>(fetchStoreItems, { pageSize: 10 });
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(Error);
        expect((error as Error).message).to.include('Invalid response');
      }
    });
  });

  describe('Real-world Usage Patterns', () => {
    it('should demonstrate e-commerce catalog pagination', async () => {
      // Simulate a real e-commerce scenario with products and categories
      const categories = generateMockCategories(5);
      const products = generateMockProducts(50);

      // Mock category pagination
      mockGraphQLClient.request.onFirstCall().resolves({
        manyCategory: {
          results: categories,
          cursor: 'cat-cursor1',
          hasMore: false,
        },
      });

      // Mock product pagination (3 pages)
      mockGraphQLClient.request
        .onSecondCall()
        .resolves({
          manyProduct: {
            results: products.slice(0, 20),
            cursor: 'prod-cursor1',
            hasMore: true,
          },
        })
        .onThirdCall()
        .resolves({
          manyProduct: {
            results: products.slice(20, 40),
            cursor: 'prod-cursor2',
            hasMore: true,
          },
        })
        .onCall(3)
        .resolves({
          manyProduct: {
            results: products.slice(40, 50),
            cursor: 'prod-cursor3',
            hasMore: false,
          },
        });

      // Fetch categories
      const fetchCategories = async (args: any): Promise<any> => {
        const response = await contentClient.get('', {
          query: `
            query GetManyCategory($pageSize: Int, $after: String) {
              manyCategory(minimumPageSize: $pageSize, after: $after) {
                results {
                  system { id name }
                  name description parentCategory
                }
                cursor hasMore
              }
            }
          `,
          variables: { pageSize: 10, after: args.after },
        });
        return (response as any).manyCategory;
      };

      // Fetch products
      const fetchProducts = async (args: any): Promise<any> => {
        const response = await contentClient.get('', {
          query: `
            query GetManyProduct($pageSize: Int, $after: String) {
              manyProduct(minimumPageSize: $pageSize, after: $after) {
                results {
                  system { id name }
                  name sku price category description
                }
                cursor hasMore
              }
            }
          `,
          variables: { pageSize: 20, after: args.after },
        });
        return (response as any).manyProduct;
      };

      // Fetch all categories and products
      const allCategories = await paginateAll<Category>(fetchCategories, { pageSize: 10 });

      const allProducts = await paginateAll<Product>(fetchProducts, { pageSize: 20 });

      expect(allCategories).to.have.length(5);
      expect(allProducts).to.have.length(50);
      expect(mockGraphQLClient.request).to.have.been.callCount(4);
    });

    it('should demonstrate performance optimization with maxPages', async () => {
      const storeItems = generateMockStoreItems(100);

      // Mock 5 pages of store items
      for (let i = 0; i < 5; i++) {
        const start = i * 20;
        const end = Math.min(start + 20, 100);
        mockGraphQLClient.request.onCall(i).resolves({
          manyStoreItem: {
            results: storeItems.slice(start, end),
            cursor: `cursor${i + 1}`,
            hasMore: i < 4,
          },
        });
      }

      const fetchStoreItems = async (args: any): Promise<any> => {
        const response = await contentClient.get('', {
          query: `
            query GetManyStoreItem($pageSize: Int, $after: String) {
              manyStoreItem(minimumPageSize: $pageSize, after: $after) {
                results {
                  system { id name }
                  price category description inStock images
                }
                cursor hasMore
              }
            }
          `,
          variables: { pageSize: 20, after: args.after },
        });
        return (response as any).manyStoreItem;
      };

      // Only fetch first 3 pages for performance
      const limitedStoreItems = await paginateAll<StoreItem>(fetchStoreItems, {
        pageSize: 20,
        maxPages: 3,
      });

      expect(limitedStoreItems).to.have.length(60);
      expect(mockGraphQLClient.request).to.have.been.calledThrice;
    });
  });
});
