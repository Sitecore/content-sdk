# Dynamic Pagination for Content SDK - Complete Guide

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Quick Start](#quick-start)
4. [Usage Patterns](#usage-patterns)
5. [Nested Pagination](#nested-pagination)
6. [Performance & Monitoring](#performance--monitoring)
7. [Error Handling](#error-handling)
8. [Real-World Examples](#real-world-examples)
9. [API Reference](#api-reference)
10. [Best Practices](#best-practices)

---

## 🎯 Overview

The Dynamic Pagination feature allows you to execute any GraphQL query with automatic pagination support, regardless of data structure. It handles cursor-based pagination, nested properties pagination, and provides performance monitoring.

### **Key Benefits**
- ✅ **Any GraphQL Query**: Execute any query with pagination
- ✅ **Any Data Structure**: Works with any response structure
- ✅ **Nested Pagination**: Paginate nested properties automatically
- ✅ **Performance Monitoring**: Built-in metrics and error tracking
- ✅ **Type Safety**: Full TypeScript support
- ✅ **Backward Compatible**: Existing code continues to work

---

## 🚀 Features

### **Core Features**
- **Dynamic Query Execution**: Any GraphQL query can be paginated
- **Automatic Cursor Handling**: No manual cursor management needed
- **Flexible Data Structures**: Works with any pagination pattern
- **Nested Pagination**: Support for nested properties pagination (1 level)
- **Performance Monitoring**: Built-in metrics and timing
- **Error Handling**: Graceful error recovery and reporting
- **Type Safety**: Full TypeScript support with generics

### **Usage Patterns**
- **Simple Mode**: One-line pagination for common use cases
- **Advanced Mode**: Full configuration for complex scenarios
- **Auto-Detection Mode**: Automatic field detection for exploratory queries

---

## 🏃‍♂️ Quick Start

### **Basic Setup**

```typescript
import { ContentClient } from '@sitecore-content-sdk/core';

const client = ContentClient.createClient({
  tenant: 'your-tenant',
  environment: 'main',
  token: 'your-token'
});
```

### **Simple Dynamic Pagination**

```typescript
// Fetch all products with automatic pagination
const products = await client.simpleDynamicPagination(
  `query GetProducts($pageSize: Int, $after: String) {
    manyProduct(minimumPageSize: $pageSize, after: $after) {
      results { id name price }
      cursor hasMore
    }
  }`,
  'manyProduct',
  { pageSize: 50 }
);

console.log(`Fetched ${products.length} products`);
```

### **Advanced Dynamic Pagination**

```typescript
const result = await client.executeDynamicPagination({
  query: `
    query GetFilteredProducts($pageSize: Int, $after: String, $category: String) {
      manyProduct(
        minimumPageSize: $pageSize, 
        after: $after,
        where: { category: { eq: $category } }
      ) {
        results { id name price }
        cursor hasMore
      }
    }
  `,
  variables: { category: 'electronics' },
  paginatedFieldPath: 'manyProduct',
  pagination: { pageSize: 25, maxPages: 10 }
});

console.log(`Total items: ${result.totalItems}`);
console.log(`API calls: ${result.metadata.apiCalls}`);
console.log(`Duration: ${result.metadata.duration}ms`);
```

---

## 📖 Usage Patterns

### **1. Simple Mode (80% of use cases)**

```typescript
// Basic pagination
const items = await client.simpleDynamicPagination(
  query,      // GraphQL query with pagination variables
  fieldPath,  // Path to paginated field (e.g., 'manyProduct')
  options     // Optional pagination settings
);
```

**Example:**
```typescript
const products = await client.simpleDynamicPagination(
  `query GetProducts($pageSize: Int, $after: String) {
    manyProduct(minimumPageSize: $pageSize, after: $after) {
      results { id name price }
      cursor hasMore
    }
  }`,
  'manyProduct',
  { pageSize: 50 }
);
```

### **2. Advanced Mode (Complex scenarios)**

```typescript
const result = await client.executeDynamicPagination({
  query: string,                    // GraphQL query
  variables?: object,               // Query variables
  paginatedFieldPath: string,       // Path to paginated field
  pagination?: {                    // Pagination options
    pageSize?: number,
    maxPages?: number
  },
  nested?: {                        // Nested pagination config
    fieldPath: string,
    getParentId: function,
    nestedQuery: string,
    nestedVariables?: function,
    pagination?: object
  }
});
```

**Example:**
```typescript
const result = await client.executeDynamicPagination({
  query: `query GetCategories($pageSize: Int, $after: String) {
    manyCategory(minimumPageSize: $pageSize, after: $after) {
      results { id name }
      cursor hasMore
    }
  }`,
  paginatedFieldPath: 'manyCategory',
  pagination: { pageSize: 20, maxPages: 5 },
  nested: {
    fieldPath: 'products',
    getParentId: (category) => category.id,
    nestedQuery: `query GetProductsInCategory($categoryId: ID!, $pageSize: Int, $after: String) {
      manyProduct(categoryId: $categoryId, minimumPageSize: $pageSize, after: $after) {
        results { id name price }
        cursor hasMore
      }
    }`,
    nestedVariables: (categoryId, args) => ({ categoryId, ...args })
  }
});
```

### **3. Auto-Detection Mode (Exploratory queries)**

```typescript
const result = await client.autoDetectPagination(
  query,      // GraphQL query
  variables,  // Query variables
  options     // Pagination options
);
```

**Example:**
```typescript
const result = await client.autoDetectPagination(
  `query GetMultipleEndpoints {
    manyProduct { results { id name } cursor hasMore }
    manyCategory { results { id name } cursor hasMore }
  }`,
  {},
  { pageSize: 25 }
);
```

---

## 🔗 Nested Pagination

### **Overview**

Nested pagination allows you to paginate through parent items AND their nested properties. Currently supports **1 level of nesting**.

### **Supported Patterns**

```typescript
// ✅ Supported: 1 level of nesting
Categories → Products
Articles → Comments
Taxonomies → Terms
Stores → Departments
```

### **Basic Nested Pagination**

```typescript
const categoriesWithProducts = await client.executeDynamicPagination({
  query: `
    query GetCategories($pageSize: Int, $after: String) {
      manyCategory(minimumPageSize: $pageSize, after: $after) {
        results { id name description }
        cursor hasMore
      }
    }
  `,
  paginatedFieldPath: 'manyCategory',
  nested: {
    fieldPath: 'products',                    // Field name for nested items
    getParentId: (category) => category.id,   // Extract parent ID
    nestedQuery: `
      query GetProductsInCategory($categoryId: ID!, $pageSize: Int, $after: String) {
        manyProduct(categoryId: $categoryId, minimumPageSize: $pageSize, after: $after) {
          results { id name price }
          cursor hasMore
        }
      }
    `,
    nestedVariables: (categoryId, args) => ({
      categoryId,
      pageSize: args.pageSize,
      after: args.after
    }),
    pagination: { pageSize: 50 }              // Nested pagination options
  }
});

// Use nested results
categoriesWithProducts.items.forEach(category => {
  console.log(`Category: ${category.name}`);
  console.log(`  Products: ${category.products.length}`);
  
  category.products.forEach(product => {
    console.log(`    - ${product.name}: $${product.price}`);
  });
});
```

### **Limitations**

- **Current Support**: 1 level of nesting
- **Not Supported**: Multiple levels (e.g., Stores → Departments → Employees)

### **Workarounds for Multiple Levels**

```typescript
// Option 1: Manual chaining
const storesWithDepartments = await client.executeDynamicPagination({
  // ... stores with departments
});

// Manually add employees
for (const store of storesWithDepartments.items) {
  for (const department of store.departments) {
    const employees = await client.simpleDynamicPagination(
      `query GetEmployees($departmentId: ID!, $pageSize: Int, $after: String) {
        manyEmployee(departmentId: $departmentId, minimumPageSize: $pageSize, after: $after) {
          results { id name }
          cursor hasMore
        }
      }`,
      'manyEmployee'
    );
    department.employees = employees;
  }
}
```

---

## 📊 Performance & Monitoring

### **Built-in Metrics**

```typescript
const result = await client.executeDynamicPagination({
  query: `...`,
  paginatedFieldPath: 'manyProduct',
  pagination: { pageSize: 50, maxPages: 5 }
});

// Performance metrics
const metrics = result.metadata;
console.log(`Performance Report:`);
console.log(`- Total items fetched: ${result.totalItems}`);
console.log(`- Total pages processed: ${result.totalPages}`);
console.log(`- API calls made: ${metrics.apiCalls}`);
console.log(`- Total duration: ${metrics.duration}ms`);
console.log(`- Average time per call: ${(metrics.duration / metrics.apiCalls).toFixed(2)}ms`);
console.log(`- Items per API call: ${(result.totalItems / metrics.apiCalls).toFixed(2)}`);
console.log(`- Errors encountered: ${metrics.errors.length}`);
```

### **Performance Optimization**

```typescript
// Optimize for fewer API calls
const optimized = await client.executeDynamicPagination({
  query: `...`,
  paginatedFieldPath: 'manyProduct',
  pagination: { 
    pageSize: 100,  // Larger page size = fewer API calls
    maxPages: 5     // Limit to prevent runaway pagination
  }
});

// Monitor and adjust
if (optimized.metadata.duration > 5000) {
  console.log('Consider increasing pageSize or reducing maxPages');
}
```

---

## ⚠️ Error Handling

### **Graceful Error Handling**

```typescript
try {
  const result = await client.executeDynamicPagination({
    query: `...`,
    paginatedFieldPath: 'manyProduct',
    pagination: { pageSize: 50, maxPages: 5 }
  });

  // Check for partial errors
  if (result.metadata.errors.length > 0) {
    console.warn('Some errors occurred during pagination:');
    result.metadata.errors.forEach(error => {
      console.warn(`  - ${error}`);
    });
  }

  // Use results even if some errors occurred
  console.log(`Successfully fetched ${result.totalItems} items`);
  
} catch (error) {
  // Handle complete failure
  console.error('Pagination completely failed:', error);
  
  // Fallback to single page
  const singlePage = await client.get(`query GetProducts {
    manyProduct(minimumPageSize: 10, after: "") {
      results { id name }
      cursor hasMore
    }
  }`);
  
  console.log('Using fallback single page data');
}
```

### **Common Error Scenarios**

```typescript
// 1. Invalid field path
try {
  await client.executeDynamicPagination({
    query: `...`,
    paginatedFieldPath: 'nonexistentField'  // ❌ Will throw error
  });
} catch (error) {
  console.error('Field not found:', error.message);
}

// 2. Invalid pagination structure
try {
  await client.executeDynamicPagination({
    query: `query GetProducts {
      manyProduct { id name }  // ❌ Missing pagination fields
    }`,
    paginatedFieldPath: 'manyProduct'
  });
} catch (error) {
  console.error('Invalid pagination structure:', error.message);
}
```

---

## 🌟 Real-World Examples

### **E-commerce Catalog**

```typescript
// Fetch all products with their variants and reviews
const ecommerceData = await client.executeDynamicPagination({
  query: `
    query GetProducts($pageSize: Int, $after: String) {
      manyProduct(minimumPageSize: $pageSize, after: $after) {
        results { 
          id 
          name 
          price 
          category 
          variants { id size color price }
        }
        cursor hasMore
      }
    }
  `,
  paginatedFieldPath: 'manyProduct',
  nested: {
    fieldPath: 'reviews',
    getParentId: (product) => product.id,
    nestedQuery: `
      query GetProductReviews($productId: ID!, $pageSize: Int, $after: String) {
        manyReview(productId: $productId, minimumPageSize: $pageSize, after: $after) {
          results { id rating comment author }
          cursor hasMore
        }
      }
    `,
    nestedVariables: (productId, args) => ({ productId, ...args })
  }
});

// Process e-commerce data
ecommerceData.items.forEach(product => {
  console.log(`Product: ${product.name}`);
  console.log(`  Price: $${product.price}`);
  console.log(`  Variants: ${product.variants.length}`);
  console.log(`  Reviews: ${product.reviews.length}`);
  
  const avgRating = product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length;
  console.log(`  Average Rating: ${avgRating.toFixed(1)}`);
});
```

### **Content Management System**

```typescript
// Fetch all articles with their comments
const contentData = await client.executeDynamicPagination({
  query: `
    query GetArticles($pageSize: Int, $after: String) {
      manyArticle(minimumPageSize: $pageSize, after: $after) {
        results { 
          id 
          title 
          content 
          author 
          publishDate 
        }
        cursor hasMore
      }
    }
  `,
  paginatedFieldPath: 'manyArticle',
  nested: {
    fieldPath: 'comments',
    getParentId: (article) => article.id,
    nestedQuery: `
      query GetArticleComments($articleId: ID!, $pageSize: Int, $after: String) {
        manyComment(articleId: $articleId, minimumPageSize: $pageSize, after: $after) {
          results { id text author timestamp }
          cursor hasMore
        }
      }
    `,
    nestedVariables: (articleId, args) => ({ articleId, ...args })
  }
});

// Generate content report
const report = {
  totalArticles: contentData.totalItems,
  totalComments: contentData.items.reduce((sum, article) => sum + article.comments.length, 0),
  averageCommentsPerArticle: 0
};

report.averageCommentsPerArticle = report.totalComments / report.totalArticles;
console.log('Content Report:', report);
```

---

## 📚 API Reference

### **ContentClient Methods**

#### **`executeDynamicPagination(config)`**

Full-featured dynamic pagination with configuration.

```typescript
async executeDynamicPagination<T = any>(
  config: DynamicPaginationConfig
): Promise<DynamicPaginationResult<T>>
```

#### **`simpleDynamicPagination(query, fieldPath, options)`**

Simplified dynamic pagination for common use cases.

```typescript
async simpleDynamicPagination<T = any>(
  query: string,
  fieldPath: string,
  options: { pageSize?: number; maxPages?: number } = {}
): Promise<T[]>
```

#### **`autoDetectPagination(query, variables, options)`**

Automatic detection of paginated fields.

```typescript
async autoDetectPagination<T = any>(
  query: string,
  variables: Record<string, any> = {},
  options: { pageSize?: number; maxPages?: number } = {}
): Promise<DynamicPaginationResult<T>>
```

### **Configuration Interfaces**

#### **`DynamicPaginationConfig`**

```typescript
interface DynamicPaginationConfig {
  query: string;                    // GraphQL query with pagination variables
  variables?: Record<string, any>;  // Query variables
  paginatedFieldPath: string;       // Path to paginated field
  pagination?: {                    // Pagination options
    pageSize?: number;              // Items per page
    maxPages?: number;              // Maximum pages to fetch
  };
  nested?: {                        // Nested pagination configuration
    fieldPath: string;              // Field name for nested items
    getParentId: (parent: any) => string;  // Extract parent ID
    nestedQuery: string;            // Nested GraphQL query
    nestedVariables?: (parentId: string, args: any) => Record<string, any>;
    pagination?: {                  // Nested pagination options
      pageSize?: number;
      maxPages?: number;
    };
  };
}
```

#### **`DynamicPaginationResult<T>`**

```typescript
interface DynamicPaginationResult<T = any> {
  items: T[];                       // All items from all pages
  totalPages: number;               // Total number of pages fetched
  totalItems: number;               // Total number of items fetched
  hasMore: boolean;                 // Whether more data is available
  metadata: {                       // Performance and error metadata
    duration: number;               // Time taken in milliseconds
    apiCalls: number;               // Number of API calls made
    errors: string[];               // Any errors that occurred
  };
}
```

---

## 🎯 Best Practices

### **1. Choose the Right Usage Pattern**

```typescript
// ✅ Use simpleDynamicPagination for basic needs
const products = await client.simpleDynamicPagination(query, fieldPath);

// ✅ Use executeDynamicPagination for complex scenarios
const result = await client.executeDynamicPagination({
  query,
  paginatedFieldPath: fieldPath,
  nested: { /* nested config */ }
});

// ✅ Use autoDetectPagination for exploratory queries
const result = await client.autoDetectPagination(query);
```

### **2. Optimize Performance**

```typescript
// ✅ Use appropriate page sizes
const optimized = await client.executeDynamicPagination({
  query: `...`,
  paginatedFieldPath: 'manyProduct',
  pagination: { 
    pageSize: 100,  // Larger for fewer API calls
    maxPages: 10    // Limit to prevent runaway pagination
  }
});

// ✅ Monitor performance
if (optimized.metadata.duration > 5000) {
  console.log('Consider optimization');
}
```

### **3. Handle Errors Gracefully**

```typescript
// ✅ Always check for errors
const result = await client.executeDynamicPagination(config);

if (result.metadata.errors.length > 0) {
  console.warn('Errors occurred:', result.metadata.errors);
}

// ✅ Use try-catch for complete failures
try {
  const result = await client.executeDynamicPagination(config);
} catch (error) {
  console.error('Complete failure:', error);
  // Implement fallback logic
}
```

### **4. Use Type Safety**

```typescript
// ✅ Define types for better development experience
interface Product {
  id: string;
  name: string;
  price: number;
}

const products = await client.simpleDynamicPagination<Product>(
  query,
  'manyProduct'
);
```

### **5. Memory Management**

```typescript
// ✅ Process large datasets in chunks
const result = await client.executeDynamicPagination({
  query: `...`,
  paginatedFieldPath: 'manyProduct',
  pagination: { pageSize: 50, maxPages: 10 }
});

// Process in batches
const batchSize = 100;
for (let i = 0; i < result.items.length; i += batchSize) {
  const batch = result.items.slice(i, i + batchSize);
  await processBatch(batch);
}
```

---

## 📝 Summary

The Dynamic Pagination feature provides a powerful, flexible solution for handling pagination in any GraphQL query. Key takeaways:

1. **Flexibility**: Works with any GraphQL query and data structure
2. **Ease of Use**: Simple API with multiple usage patterns
3. **Performance**: Built-in monitoring and optimization features
4. **Reliability**: Comprehensive error handling and recovery
5. **Type Safety**: Full TypeScript support
6. **Backward Compatibility**: Existing code continues to work

Choose the right usage pattern for your needs:
- **Simple**: Use `simpleDynamicPagination()` for basic pagination
- **Advanced**: Use `executeDynamicPagination()` for complex scenarios
- **Exploratory**: Use `autoDetectPagination()` for unknown structures

Monitor performance, handle errors gracefully, and optimize based on your specific use case. The solution is production-ready and designed to handle real-world scenarios efficiently. 