import type { LoaderContext, LoaderFinalizer, Page } from '@sitecore-content-sdk/angular';
import { getPersonalizeTokens, shouldBypassPageFinalization } from '@sitecore-content-sdk/angular';
import { getClient } from '../client/sitecore-client';
import type { TokenMap } from '@sitecore-content-sdk/content/personalize';

function finalizePublishedPage(page: Page, tokens: TokenMap): Page {
  if (shouldBypassPageFinalization(page)) {
    return page;
  }
  return getClient().finalizePersonalizedPage(page, tokens);
}

/**
 * Request-local page finalizer. Preview and Design Library results are returned
 * unchanged so authored token literals and existing content rewrite are preserved.
 * @param {Page} page Raw deferred page
 * @param {LoaderContext} context Request context
 * @returns {Page} Finalized page or the bypassed preview/Design Library page
 */
export const finalizePageLoader: LoaderFinalizer<Page> = (page, context) => {
  return finalizePublishedPage(page, getPersonalizeTokens(context) ?? {});
};

/**
 * Error-page finalizer. Published error layouts always use `tokens: {}`.
 * @param {Page} page Raw deferred error page
 * @returns {Page} Finalized error page
 */
export const finalizeErrorPageLoader: LoaderFinalizer<Page> = (page) => {
  return finalizePublishedPage(page, {});
};
