import type { Page } from '@sitecore-content-sdk/angular';
import { LayoutServicePageState } from '@sitecore-content-sdk/angular';

/**
 * Stub helpers for error/not-found loaders.
 * Returns minimal valid Page shapes until proper error-page handling is implemented.
 */

/**
 * Returns a stubbed Page for not-found (404) or error (500) loaders with an error message in route.fields.error.
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
