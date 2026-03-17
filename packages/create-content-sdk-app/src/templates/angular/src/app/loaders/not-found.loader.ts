import type { LoaderFn, Page } from '@sitecore-content-sdk/angular';
import { errorPageResult } from './stub-utils';

const DEFAULT_MESSAGE = 'Page Not Found';

/**
 * 404 loader. Returns a page with route.fields.error set to the message.
 * The NotFound component should read layout.sitecore.route.fields?.error?.value for custom text.
 */
export const notFoundLoader: LoaderFn<Page> = async (context) => {
  return errorPageResult(context.url, DEFAULT_MESSAGE);
};
