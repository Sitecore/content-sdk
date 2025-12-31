import {
  LoaderFn,
  isEditingMode,
  isDesignLibraryRequest,
  parseEditingPreviewData,
  parseDesignLibraryPreviewData,
} from '@sitecore-content-sdk/angular';
import { client } from './sitecore-client';
import config from '../sitecore.config';

/**
 * Validates that the incoming secret matches the configured editing secret
 * @param secret - The secret from query parameters
 * @returns true if secret is valid and matches configured value
 */
function validateSecret(secret: string | string[] | undefined): boolean {
  if (!secret || !config.editingSecret) {
    return false;
  }
  const secretValue = Array.isArray(secret) ? secret[0] : secret;
  return secretValue === config.editingSecret;
}

export const pageLoader: LoaderFn = async ({ url, query }) => {
  console.log('pageLoader called with url:', url);

  // Check if this is an editing mode request (edit, preview, or design library)
  if (isEditingMode(query)) {
    // Validate secret before proceeding
    if (!validateSecret(query.secret)) {
      console.error('Invalid or missing editing secret');
      throw new Error('Invalid or missing editing secret');
    }

    // Check if this is Design Library mode (component rendering)
    if (isDesignLibraryRequest(query.mode)) {
      console.log('Loading Design Library page');
      const designLibData = parseDesignLibraryPreviewData(query);
      return client.getDesignLibraryData(designLibData);
    }

    // Otherwise, it's edit or preview mode
    console.log('Loading preview/edit page');
    const previewData = parseEditingPreviewData(query);
    return client.getPreview(previewData);
  }

  // Normal page request
  const page = await client.getPage(url);
  return page;
};
