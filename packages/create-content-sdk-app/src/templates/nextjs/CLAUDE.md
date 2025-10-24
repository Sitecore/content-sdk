# Claude Code Agent Guide for Sitecore Content SDK Next.js Project

## Project Purpose and Tech Stack

This is a **Sitecore Content SDK** application built with **Next.js** and **TypeScript**. The project follows Sitecore best practices for XM Cloud development and provides a modern, performant web application framework.

### Key Technologies
- **Next.js** - React framework with SSR/SSG capabilities
- **Sitecore Content SDK** - Official SDK for Sitecore XM Cloud integration
- **TypeScript** - Type-safe JavaScript development
- **Sitecore XM Cloud** - Headless CMS platform
- **React** - Component-based UI library

## Coding Standards

### TypeScript Standards
- Use **strict mode** in tsconfig.json
- Prefer type assertions over `any`: `value as ContentItem`
- Use discriminated unions for complex state management
- Enable strict null checks and strict function types

### Naming Conventions
- **Variables/Functions**: camelCase (`getUserData()`, `isLoading`, `currentUser`)
- **Components**: PascalCase (`SitecoreComponent`, `PageLayout`, `ContentBlock`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINT`, `DEFAULT_TIMEOUT`)
- **Directories**: kebab-case (`src/components`, `src/api-clients`)
- **Types/Interfaces**: PascalCase (`ContentItem`, `LayoutProps`, `SitecoreConfig`)

### Modular Layout
```
src/
  components/          # UI components (React)
  lib/                 # Configuration and utilities
  pages/               # Next.js pages
  assets/              # Static assets and styles
  types/               # TypeScript type definitions
  hooks/               # Custom React hooks
```

## Library Usage

### @sitecore-content-sdk
- Use `SitecoreClient` for content fetching
- Implement proper error handling with try/catch blocks
- Cache API responses using React Query or SWR
- Handle content preview vs. published content scenarios

```typescript
import { SitecoreClient } from '@sitecore-content-sdk/nextjs/client';
import scConfig from 'sitecore.config';

const client = new SitecoreClient({
  ...scConfig,
});
```

### React Patterns
- Use **Server Components** for data fetching and static content
- Use **Client Components** for interactivity (use 'use client')
- Implement proper error boundaries
- Use React.memo for expensive components
- Leverage useCallback and useMemo for performance optimization

### Sitecore Field Components
- Always use Sitecore field components: `<Text>`, `<RichText>`, `<Image>`
- Validate field existence before rendering
- Handle empty/null fields gracefully
- Prefer Sitecore field components over manual rendering

```typescript
// Good: Using Sitecore field components
<Text field={fields?.title} tag="h1" />
<RichText field={fields?.content} />
<Image field={fields?.backgroundImage} />

// Avoid: Manual field value extraction unless necessary
```

## Example Patterns and Prompts

### Component Development
```typescript
// Component props interface
interface HeroProps {
  fields: {
    title: Field;
    subtitle: Field;
    backgroundImage: Field;
  };
}

export default function Hero({ fields }: HeroProps) {
  return (
    <div>
      <Text field={fields?.title} tag="h1" />
      <Text field={fields?.subtitle} tag="p" />
      <Image field={fields?.backgroundImage} />
    </div>
  );
}
```

### Error Handling
```typescript
async function fetchPageData(path: string): Promise<Page | null> {
  if (!path) {
    throw new Error('Page path is required');
  }

  try {
    const pageData = await client.getPage(path);
    return pageData;
  } catch (error) {
    throw new SitecoreFetchError(`Failed to fetch page data for ${path}`, error);
  }
}
```

### Configuration
```typescript
// sitecore.config.ts
import { defineConfig } from '@sitecore-content-sdk/nextjs/config';

export default defineConfig({
  api: {
    edge: {
      contextId: process.env.SITECORE_EDGE_CONTEXT_ID || '',
      clientContextId: process.env.NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID,
      edgeUrl: process.env.SITECORE_EDGE_URL || 'https://edge-platform.sitecorecloud.io',
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

## Development Workflow

1. **Install dependencies**: `npm install`
2. **Configure environment**: Copy `.env.example` to `.env.local`
3. **Start development**: `npm run dev`
4. **Build for production**: `npm run build`

## Best Practices

### Performance
- Optimize images using Next.js Image component
- Implement proper loading states
- Cache expensive operations appropriately
- Consider server-side rendering implications
- Lazy-load non-critical modules

### Security
- Sanitize user inputs before processing
- Validate data at application boundaries
- Use HTTPS for all Sitecore connections
- Never expose sensitive configuration in client-side code
- Escape content when rendering to prevent XSS

### Code Quality
- Follow DRY principle - extract common functionality
- Use SOLID principles for maintainable code
- Write self-documenting code with clear intent
- Implement proper error boundaries
- Test behavior, not implementation details
