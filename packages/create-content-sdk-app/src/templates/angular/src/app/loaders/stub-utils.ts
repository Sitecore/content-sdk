import type { Page } from '@sitecore-content-sdk/angular';
import { LayoutServicePageState } from '@sitecore-content-sdk/angular';

/**
 * Stub helpers until proper implementation (e.g. Sitecore layout service integration).
 * Used by app loaders to return minimal valid Page shapes.
 */

/**
 * Returns a stubbed Page for the page loader: route data, mode data, 'en' locale and basic text fields.
 * Replace with real layout/route data from Sitecore when implemented.
 */
export function stubPageResult(url: string): Page {
  return {
    layout: {
      sitecore: {
        context: {
          url,
        },
        route: {
          name: url,
          placeholders: {},
          fields: {},
          databaseName: 'web',
          deviceId: 'web',
          itemLanguage: 'en',
          itemVersion: 1,
          layoutId: '123',
          templateId: '123',
          templateName: '123',
        },
      },
    },
    locale: 'en',
    mode: {
      name: LayoutServicePageState.Normal,
      isNormal: true,
      isPreview: false,
      isEditing: false,
      isDesignLibrary: false,
      designLibrary: {
        isVariantGeneration: false,
      },
    },
  };
}

/**
 * Returns a stubbed Page for not-found (404) or error (500) loaders with an error message in route.fields.error.
 * Replace with proper error page handling when implemented.
 */
export function errorPageResult(url: string, errorMessage: string): Page {
  return {
    layout: {
      sitecore: {
        context: { url },
        route: {
          name: url,
          placeholders: {},
          fields: {
            error: { value: errorMessage },
          },
          databaseName: 'web',
          deviceId: 'web',
          itemLanguage: 'en',
          itemVersion: 1,
          layoutId: '123',
          templateId: '123',
          templateName: '123',
        },
      },
    },
    locale: 'en',
    mode: {
      name: LayoutServicePageState.Normal,
      isNormal: true,
      isPreview: false,
      isEditing: false,
      isDesignLibrary: false,
      designLibrary: { isVariantGeneration: false },
    },
  };
}
