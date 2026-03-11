import type { LoaderFn } from '../models';
import type { Page } from '@sitecore-content-sdk/content/client';
import { errorPageResult } from './stub-utils';

const DEFAULT_MESSAGE = 'Internal Server Error';

/**
 * Default 500 loader. Returns a page with route.fields.error set to the message.
 * The Error component should read layout.sitecore.route.fields?.error?.value for custom text.
 */
export const errorLoader: LoaderFn<Page> = async (context) => {
  return errorPageResult(context.url, DEFAULT_MESSAGE);
};
