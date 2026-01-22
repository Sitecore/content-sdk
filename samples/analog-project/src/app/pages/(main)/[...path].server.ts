import { PageServerLoad } from '@analogjs/router';
import { getQuery } from 'h3';
import {
  isEditingMode,
  isDesignLibraryRequest,
  parseEditingPreviewData,
  parseDesignLibraryPreviewData,
  ErrorPage,
} from '@sitecore-content-sdk/angular';
import { client } from '../../../lib/sitecore-client';
import config from '../../../sitecore.config';

export const load = async ({ params, event }: PageServerLoad) => {
  // Get the URL path from the catch-all params
  try {
    const pathSegments = params?.path || [];
    const url = '/' + (Array.isArray(pathSegments) ? pathSegments.join('/') : pathSegments);
    const query = getQuery(event) as Record<string, string | string[] | undefined>;

    console.log('Analog server loader - Dynamic page URL:', url);

    // Check if this is an editing mode request
    if (isEditingMode(query)) {
      const secret = query.secret;
      const secretValue = Array.isArray(secret) ? secret[0] : secret;

      if (!secretValue || secretValue !== config.editingSecret) {
        console.error('Invalid or missing editing secret');
        throw new Error('Invalid or missing editing secret');
      }

      if (isDesignLibraryRequest(query.mode)) {
        console.log('Loading Design Library page');
        const designLibData = parseDesignLibraryPreviewData(query);
        return { page: await client.getDesignLibraryData(designLibData) };
      }

      console.log('Loading preview/edit page');
      const previewData = parseEditingPreviewData(query);
      return { page: await client.getPreview(previewData) };
    }

    let page = await client.getPage(url);

    if (!page) {
      console.error('Page not found');
      page = await client.getErrorPage(ErrorPage.NotFound, {
        site: config.defaultSite,
        locale: config.defaultLanguage,
      });
    }

    return {
      page,
    };
  } catch (error) {
    console.error('Error loading page:', error);
    const page = await client.getErrorPage(ErrorPage.InternalServerError, {
      site: config.defaultSite,
      locale: config.defaultLanguage,
    });

    return {
      page,
    };
  }
};
