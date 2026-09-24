export { pageLoader } from './page.loader';
export { dictionaryLoader } from './dictionary.loader';
export { notFoundLoader } from './not-found.loader';
export { errorLoader } from './error.loader';
export { finalizePageLoader, finalizeErrorPageLoader } from './finalize-page.loader';

import { pageLoader } from './page.loader';
import { dictionaryLoader } from './dictionary.loader';
import { notFoundLoader } from './not-found.loader';
import { errorLoader } from './error.loader';
import { finalizePageLoader, finalizeErrorPageLoader } from './finalize-page.loader';

/** Loaders object for use in provideLoaderRegistry() and createLoaderDataServiceMiddleware(). */
export const LOADERS = {
  page: {
    load: pageLoader,
    finalize: finalizePageLoader,
  },
  dictionary: dictionaryLoader,
  '404': {
    load: notFoundLoader,
    finalize: finalizeErrorPageLoader,
  },
  '500': {
    load: errorLoader,
    finalize: finalizeErrorPageLoader,
  },
};
