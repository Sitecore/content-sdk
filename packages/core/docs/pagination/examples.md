# Pagination Utility Examples

This document provides practical examples of using the pagination utility in various real-world scenarios.

## Basic Examples

### Example 1: Fetch All Products

```typescript
import { ContentClient } from '@sitecore-content-sdk/core';
import { paginateAll } from '@sitecore-content-sdk/core';

const client = ContentClient.createClient({
  tenant: 'my-tenant',
  token: 'my-token',
});

// Define the fetch function
const fetchProducts = async (cursor?: string) => {
  return client.get(`
    query GetManyProduct($pageSize: Int, $after: String) {
      manyProduct(minimumPageSize: $pageSize, after: $after) {
        results {
          system { id name }
          name sku price category
        }
        cursor hasMore
      }
    }
  `, { pageSize: 50, after: cursor });
};

// Fetch all products
const allProducts = await paginateAll(fetchProducts, 'manyProduct', {
  pageSize: 50
});

console.log(`Fetched ${allProducts.length} products`);
```

### Example 2: Fetch Categories with Error Handling

```typescript
const fetchCategories = async (cursor?: string) => {
  return client.get(`
    query GetManyCategory($pageSize: Int, $after: String) {
      manyCategory(minimumPageSize: $pageSize, after: $after) {
        results {
          system { id name }
          name description parentCategory
        }
        cursor hasMore
      }
    }
  `, { pageSize: 25, after: cursor });
};

try {
  const allCategories = await paginateAll(fetchCategories, 'manyCategory', {
    pageSize: 25,
    maxPages: 10 // Safety limit
  });
  
  console.log(`Successfully fetched ${allCategories.length} categories`);
} catch (error) {
  console.error('Failed to fetch categories:', error.message);
}
```

## Advanced Examples

### Example 3: E-commerce Product Catalog

```typescript
interface Product {
  system: { id: string; name: string };
  name: string;
  sku: string;
  price: number;
  category: string;
  inStock: boolean;
}

const fetchProducts = async (cursor?: string) => {
  return client.get(`
    query GetManyProduct($pageSize: Int, $after: String) {
      manyProduct(minimumPageSize: $pageSize, after: $after) {
        results {
          system { id name }
          name sku price category inStock
        }
        cursor hasMore
      }
    }
  `, { pageSize: 100, after: cursor });
};

// Fetch and process products
const allProducts = await paginateAll<Product, any>(fetchProducts, 'manyProduct', {
  pageSize: 100
});

// Group by category
const productsByCategory = allProducts.reduce((acc, product) => {
  const category = product.category;
  if (!acc[category]) acc[category] = [];
  acc[category].push(product);
  return acc;
}, {} as Record<string, Product[]>);

// Find in-stock products
const inStockProducts = allProducts.filter(product => product.inStock);

// Calculate total inventory value
const totalValue = allProducts.reduce((sum, product) => sum + product.price, 0);

console.log(`Total products: ${allProducts.length}`);
console.log(`In-stock products: ${inStockProducts.length}`);
console.log(`Total inventory value: $${totalValue.toFixed(2)}`);
```

### Example 4: Content Management System

```typescript
interface Article {
  system: { id: string; name: string; created: string; updated: string };
  title: string;
  content: string;
  author: string;
  tags: string[];
  published: boolean;
}

const fetchArticles = async (cursor?: string) => {
  return client.get(`
    query GetManyArticle($pageSize: Int, $after: String) {
      manyArticle(minimumPageSize: $pageSize, after: $after) {
        results {
          system { id name created updated }
          title content author tags published
        }
        cursor hasMore
      }
    }
  `, { pageSize: 50, after: cursor });
};

const allArticles = await paginateAll<Article, any>(fetchArticles, 'manyArticle', {
  pageSize: 50
});

// Sort by creation date (newest first)
const sortedArticles = allArticles.sort((a, b) => 
  new Date(b.system.created).getTime() - new Date(a.system.created).getTime()
);

// Group by author
const articlesByAuthor = allArticles.reduce((acc, article) => {
  const author = article.author;
  if (!acc[author]) acc[author] = [];
  acc[author].push(article);
  return acc;
}, {} as Record<string, Article[]>);

// Find published articles
const publishedArticles = allArticles.filter(article => article.published);

// Get unique tags
const allTags = [...new Set(allArticles.flatMap(article => article.tags))];

console.log(`Total articles: ${allArticles.length}`);
console.log(`Published articles: ${publishedArticles.length}`);
console.log(`Unique tags: ${allTags.join(', ')}`);
```

### Example 5: User Management System

```typescript
interface User {
  system: { id: string; name: string; created: string };
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  active: boolean;
  lastLogin?: string;
}

const fetchUsers = async (cursor?: string) => {
  return client.get(`
    query GetManyUser($pageSize: Int, $after: String) {
      manyUser(minimumPageSize: $pageSize, after: $after) {
        results {
          system { id name created }
          email firstName lastName role active lastLogin
        }
        cursor hasMore
      }
    }
  `, { pageSize: 75, after: cursor });
};

const allUsers = await paginateAll<User, any>(fetchUsers, 'manyUser', {
  pageSize: 75
});

// Group by role
const usersByRole = allUsers.reduce((acc, user) => {
  const role = user.role;
  if (!acc[role]) acc[role] = [];
  acc[role].push(user);
  return acc;
}, {} as Record<string, User[]>);

// Find active users
const activeUsers = allUsers.filter(user => user.active);

// Find users who haven't logged in recently (30 days)
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const inactiveUsers = allUsers.filter(user => {
  if (!user.lastLogin) return true;
  return new Date(user.lastLogin) < thirtyDaysAgo;
});

console.log(`Total users: ${allUsers.length}`);
console.log(`Active users: ${activeUsers.length}`);
console.log(`Inactive users: ${inactiveUsers.length}`);
```

## Performance Examples

### Example 6: Large Dataset Processing

```typescript
interface Order {
  system: { id: string; created: string };
  orderNumber: string;
  customerId: string;
  total: number;
  status: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
}

const fetchOrders = async (cursor?: string) => {
  return client.get(`
    query GetManyOrder($pageSize: Int, $after: String) {
      manyOrder(minimumPageSize: $pageSize, after: $after) {
        results {
          system { id created }
          orderNumber customerId total status
          items { productId quantity price }
        }
        cursor hasMore
      }
    }
  `, { pageSize: 200, after: cursor });
};

// Process large dataset in chunks
const processLargeDataset = async () => {
  console.log('Starting large dataset processing...');
  
  const allOrders = await paginateAll<Order, any>(fetchOrders, 'manyOrder', {
    pageSize: 200,
    maxPages: 50 // Limit to 10,000 orders maximum
  });
  
  console.log(`Processing ${allOrders.length} orders...`);
  
  // Process in batches of 1000
  const batchSize = 1000;
  let processed = 0;
  
  for (let i = 0; i < allOrders.length; i += batchSize) {
    const batch = allOrders.slice(i, i + batchSize);
    
    // Process batch
    await processOrderBatch(batch);
    
    processed += batch.length;
    console.log(`Processed ${processed}/${allOrders.length} orders (${Math.round(processed/allOrders.length*100)}%)`);
  }
  
  console.log('Large dataset processing completed!');
};

const processOrderBatch = async (orders: Order[]) => {
  // Simulate batch processing
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Calculate batch statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const avgOrderValue = totalRevenue / orders.length;
  
  console.log(`Batch stats: ${orders.length} orders, $${totalRevenue.toFixed(2)} revenue, $${avgOrderValue.toFixed(2)} avg order`);
};
```

### Example 7: Rate Limiting and Retry Logic

```typescript
const fetchWithRetry = async (cursor?: string, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await client.get(`
        query GetManyProduct($pageSize: Int, $after: String) {
          manyProduct(minimumPageSize: $pageSize, after: $after) {
            results {
              system { id name }
              name sku price category
            }
            cursor hasMore
          }
        }
      `, { pageSize: 50, after: cursor });
    } catch (error) {
      if (error.message.includes('429') && attempt < retries) {
        // Rate limited - wait with exponential backoff
        const delay = Math.pow(2, attempt) * 1000;
        console.log(`Rate limited, waiting ${delay}ms before retry ${attempt + 1}`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};

const allProducts = await paginateAll(fetchWithRetry, 'manyProduct', {
  pageSize: 50
});
```

## Integration Examples

### Example 8: Integration with React Hook

```typescript
import { useState, useEffect } from 'react';
import { ContentClient } from '@sitecore-content-sdk/core';
import { paginateAll } from '@sitecore-content-sdk/core';

interface Product {
  system: { id: string; name: string };
  name: string;
  price: number;
  category: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const client = ContentClient.createClient({
          tenant: 'my-tenant',
          token: 'my-token',
        });

        const fetchProductsPage = async (cursor?: string) => {
          return client.get(`
            query GetManyProduct($pageSize: Int, $after: String) {
              manyProduct(minimumPageSize: $pageSize, after: $after) {
                results {
                  system { id name }
                  name price category
                }
                cursor hasMore
              }
            }
          `, { pageSize: 50, after: cursor });
        };

        const allProducts = await paginateAll<Product, any>(fetchProductsPage, 'manyProduct', {
          pageSize: 50
        });

        setProducts(allProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading, error };
};
```

### Example 9: Integration with Next.js API Route

```typescript
// pages/api/products.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { ContentClient } from '@sitecore-content-sdk/core';
import { paginateAll } from '@sitecore-content-sdk/core';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = ContentClient.createClient({
      tenant: process.env.SITECORE_CS_TENANT!,
      token: process.env.SITECORE_CS_TOKEN!,
    });

    const fetchProducts = async (cursor?: string) => {
      return client.get(`
        query GetManyProduct($pageSize: Int, $after: String) {
          manyProduct(minimumPageSize: $pageSize, after: $after) {
            results {
              system { id name }
              name price category
            }
            cursor hasMore
          }
        }
      `, { pageSize: 100, after: cursor });
    };

    const allProducts = await paginateAll(fetchProducts, 'manyProduct', {
      pageSize: 100
    });

    res.status(200).json({
      products: allProducts,
      count: allProducts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch products',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
```

## Testing Examples

### Example 10: Unit Test with Mocking

```typescript
import { expect } from 'chai';
import sinon from 'sinon';
import { paginateAll } from '@sitecore-content-sdk/core';

describe('Product Pagination', () => {
  let mockFetchFunction: sinon.SinonStub;

  beforeEach(() => {
    mockFetchFunction = sinon.stub();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should fetch all products across multiple pages', async () => {
    // Mock responses for 3 pages
    mockFetchFunction
      .onFirstCall()
      .resolves({
        manyProduct: {
          results: [{ id: '1', name: 'Product 1' }, { id: '2', name: 'Product 2' }],
          cursor: 'cursor1',
          hasMore: true,
        },
      })
      .onSecondCall()
      .resolves({
        manyProduct: {
          results: [{ id: '3', name: 'Product 3' }],
          cursor: 'cursor2',
          hasMore: false,
        },
      });

    const allProducts = await paginateAll(mockFetchFunction, 'manyProduct', {
      pageSize: 2
    });

    expect(allProducts).to.have.length(3);
    expect(mockFetchFunction).to.have.been.calledTwice;
    expect(allProducts[0].name).to.equal('Product 1');
    expect(allProducts[2].name).to.equal('Product 3');
  });

  it('should handle single page response', async () => {
    mockFetchFunction.resolves({
      manyProduct: {
        results: [{ id: '1', name: 'Product 1' }],
        cursor: 'cursor1',
        hasMore: false,
      },
    });

    const allProducts = await paginateAll(mockFetchFunction, 'manyProduct');

    expect(allProducts).to.have.length(1);
    expect(mockFetchFunction).to.have.been.calledOnce;
  });

  it('should respect maxPages limit', async () => {
    // Mock responses that would continue indefinitely
    mockFetchFunction.resolves({
      manyProduct: {
        results: [{ id: '1', name: 'Product 1' }],
        cursor: 'cursor1',
        hasMore: true,
      },
    });

    const allProducts = await paginateAll(mockFetchFunction, 'manyProduct', {
      pageSize: 1,
      maxPages: 3
    });

    expect(allProducts).to.have.length(3);
    expect(mockFetchFunction).to.have.been.calledThrice;
  });
});
```

These examples demonstrate various use cases and best practices for using the pagination utility in different scenarios. Each example can be adapted and extended based on your specific requirements. 