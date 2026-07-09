# Sitecore SDK rules

XM Cloud integration, components, content client, and placeholders. Cursor: [`.cursor/rules/sitecore.mdc`](../../.cursor/rules/sitecore.mdc).

## XM Cloud integration

**Configuration:**

- Always use environment variables for API endpoints and keys
- Never hardcode API keys in source code
- Use `.env.example` files to document required environment variables
- Prefer `sitecore.config.ts` for centralized configuration

```typescript
// sitecore.config.ts
import { defineConfig } from '@sitecore-content-sdk/nextjs/config';

export default defineConfig({
  api: {
    edge: {
      contextId: process.env.SITECORE_EDGE_CONTEXT_ID || '',
      clientContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID,
      edgeUrl:
        process.env.NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME ||
        process.env.SITECORE_EDGE_PLATFORM_HOSTNAME ||
        'https://edge-platform.sitecorecloud.io',
    },
    local: {
      apiKey: process.env.SITECORE_API_KEY || '',
      apiHost: process.env.SITECORE_API_HOST || '',
    },
  },
  defaultSite: process.env.NEXT_PUBLIC_DEFAULT_SITE_NAME || 'default',
  defaultLanguage: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en',
  editingSecret: process.env.SITECORE_EDITING_SECRET,
});
```

**API client usage:**

- Use HTTPS for all XM Cloud endpoints
- Implement proper retry logic with exponential backoff
- Cache responses appropriately (consider content freshness)
- Handle GraphQL errors gracefully

## Component development

**Naming:**

- Use descriptive, feature-based names: `HeroWithContent`, `ProductListing`, `ContentBlockGrid`
- Follow PascalCase convention
- Include component type in name when helpful: `LayoutContainer`, `ContentRenderer`

**Registration:**

- Register components in the component map
- Use consistent component names across registration and files
- Include TypeScript types for all component props

```typescript
interface ContentBlockProps {
  fields: {
    title: Field;
    content: Field;
    image: Field;
  };
}
```

## Content management

**Field handling:**

- Always validate field existence before rendering
- Use helper functions for common field operations
- Handle empty/null fields gracefully
- Prefer Sitecore field components over manual rendering

```typescript
// Good: Using Sitecore field components
<Text field={fields?.title} tag="h1" />
<RichText field={fields?.content} />

// Avoid: Manual field value extraction unless necessary
```

**Content SDK client methods:**

- Prefer `scClient.getPage()` for page data and layout fetching
- Use `scClient.getDictionary()` for localized content
- Leverage `scClient.getErrorPage()` for error page handling
- Use `scClient.getPreview()` for preview mode content
- Implement proper error boundaries for layout rendering
- Handle missing placeholder content gracefully
- Cache layout data when appropriate

## Performance and security

**Content fetching:**

- Implement caching strategy for content (React Query recommended)
- Use GraphQL queries efficiently (avoid over-fetching)
- Implement proper loading states and error handling
- Consider content preview vs. published content scenarios

Security: see [RULES-safety.md](RULES-safety.md).

## Development patterns

**Error handling:**

- Create custom error classes: `SitecoreFetchError`, `ComponentRenderError`
- Log errors appropriately for debugging
- Provide fallback content when components fail to render
- Use error boundaries in React applications

**Placeholder management:**

- Use strongly-typed placeholder names
- Handle dynamic placeholders appropriately
- Implement fallback rendering for missing placeholders
- Follow Sitecore's placeholder naming conventions

**Testing:**

- Mock Sitecore services in unit tests
- Test component rendering with various field configurations
- Include tests for error scenarios (missing fields, API failures)
- Use Sitecore's test data helpers when available
