/**
 * Example dynamic endpoint types and implementations
 * These represent auto-generated endpoints from Content Services
 */

// Example Store Item types
export interface StoreItemSystem {
  id: string;
  name: string;
  displayName: string;
  path: string;
  template: {
    id: string;
    name: string;
  };
  language: {
    name: string;
  };
  version: number;
  created: string;
  updated: string;
}

export interface StoreItem {
  system: StoreItemSystem;
  price: number;
  category: string;
  description?: string;
  inStock: boolean;
  images?: string[];
}

// Example Category types
export interface CategorySystem {
  id: string;
  name: string;
  displayName: string;
  path: string;
  template: {
    id: string;
    name: string;
  };
  language: {
    name: string;
  };
  version: number;
  created: string;
  updated: string;
}

export interface Category {
  system: CategorySystem;
  name: string;
  description?: string;
  parentCategory?: string;
}

// Example Product types
export interface ProductSystem {
  id: string;
  name: string;
  displayName: string;
  path: string;
  template: {
    id: string;
    name: string;
  };
  language: {
    name: string;
  };
  version: number;
  created: string;
  updated: string;
}

export interface Product {
  system: ProductSystem;
  name: string;
  sku: string;
  price: number;
  category: string;
  description?: string;
  specifications?: Record<string, unknown>;
}

// GraphQL queries for dynamic endpoints
export const GET_MANY_STORE_ITEM_QUERY = `
  query GetManyStoreItem($pageSize: Int, $after: String) {
    manyStoreItem(minimumPageSize: $pageSize, after: $after) {
      results {
        system {
          id
          name
          displayName
          path
          template {
            id
            name
          }
          language {
            name
          }
          version
          created
          updated
        }
        price
        category
        description
        inStock
        images
      }
      cursor
      hasMore
    }
  }
`;

export const GET_MANY_CATEGORY_QUERY = `
  query GetManyCategory($pageSize: Int, $after: String) {
    manyCategory(minimumPageSize: $pageSize, after: $after) {
      results {
        system {
          id
          name
          displayName
          path
          template {
            id
            name
          }
          language {
            name
          }
          version
          created
          updated
        }
        name
        description
        parentCategory
      }
      cursor
      hasMore
    }
  }
`;

export const GET_MANY_PRODUCT_QUERY = `
  query GetManyProduct($pageSize: Int, $after: String) {
    manyProduct(minimumPageSize: $pageSize, after: $after) {
      results {
        system {
          id
          name
          displayName
          path
          template {
            id
            name
          }
          language {
            name
          }
          version
          created
          updated
        }
        name
        sku
        price
        category
        description
        specifications
      }
      cursor
      hasMore
    }
  }
`;

// Response types for dynamic endpoints
export interface ManyStoreItemResponse {
  manyStoreItem: {
    results: StoreItem[];
    cursor?: string;
    hasMore: boolean;
  };
}

export interface ManyCategoryResponse {
  manyCategory: {
    results: Category[];
    cursor?: string;
    hasMore: boolean;
  };
}

export interface ManyProductResponse {
  manyProduct: {
    results: Product[];
    cursor?: string;
    hasMore: boolean;
  };
}

// Mock data generators for testing
export function generateMockStoreItems(count: number): StoreItem[] {
  return Array.from({ length: count }, (_, i) => ({
    system: {
      id: `store-item-${i + 1}`,
      name: `Store Item ${i + 1}`,
      displayName: `Store Item ${i + 1}`,
      path: `/store/items/item-${i + 1}`,
      template: {
        id: 'store-item-template',
        name: 'Store Item',
      },
      language: {
        name: 'en',
      },
      version: 1,
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z',
    },
    price: Math.floor(Math.random() * 1000) + 10,
    category: ['Electronics', 'Clothing', 'Books', 'Home'][i % 4],
    description: `Description for store item ${i + 1}`,
    inStock: Math.random() > 0.3,
    images: [`image-${i + 1}-1.jpg`, `image-${i + 1}-2.jpg`],
  }));
}

export function generateMockCategories(count: number): Category[] {
  return Array.from({ length: count }, (_, i) => ({
    system: {
      id: `category-${i + 1}`,
      name: `Category ${i + 1}`,
      displayName: `Category ${i + 1}`,
      path: `/categories/category-${i + 1}`,
      template: {
        id: 'category-template',
        name: 'Category',
      },
      language: {
        name: 'en',
      },
      version: 1,
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z',
    },
    name: `Category ${i + 1}`,
    description: `Description for category ${i + 1}`,
    parentCategory: i > 0 ? `category-${Math.floor(i / 2)}` : undefined,
  }));
}

export function generateMockProducts(count: number): Product[] {
  return Array.from({ length: count }, (_, i) => ({
    system: {
      id: `product-${i + 1}`,
      name: `Product ${i + 1}`,
      displayName: `Product ${i + 1}`,
      path: `/products/product-${i + 1}`,
      template: {
        id: 'product-template',
        name: 'Product',
      },
      language: {
        name: 'en',
      },
      version: 1,
      created: '2024-01-01T00:00:00Z',
      updated: '2024-01-01T00:00:00Z',
    },
    name: `Product ${i + 1}`,
    sku: `SKU-${String(i + 1).padStart(6, '0')}`,
    price: Math.floor(Math.random() * 500) + 50,
    category: ['Electronics', 'Clothing', 'Books', 'Home'][i % 4],
    description: `Description for product ${i + 1}`,
    specifications: {
      weight: `${Math.floor(Math.random() * 10) + 1}kg`,
      dimensions: `${Math.floor(Math.random() * 50) + 10}x${Math.floor(Math.random() * 30) +
        5}x${Math.floor(Math.random() * 20) + 2}cm`,
      color: ['Red', 'Blue', 'Green', 'Black', 'White'][i % 5],
    },
  }));
}

// Mock cursor generator for testing
export function generateNextCursor(currentCursor: string): string {
  const cursorNum = parseInt(currentCursor.replace('cursor', ''), 10);
  return `cursor${cursorNum + 1}`;
}
