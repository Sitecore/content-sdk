export { pageLoader } from './page.loader';
export { dictionaryLoader } from './dictionary.loader';
export { notFoundLoader } from './not-found.loader';
export { errorLoader } from './error.loader';

import { pageLoader } from './page.loader';
import { dictionaryLoader } from './dictionary.loader';
import { notFoundLoader } from './not-found.loader';
import { errorLoader } from './error.loader';

/** Loaders object for use in provideLoaderRegistry() and createLoaderDataServiceMiddleware(). */
export const LOADERS = {
  page: pageLoader,
  dictionary: dictionaryLoader,
  '404': notFoundLoader,
  '500': errorLoader,
};
