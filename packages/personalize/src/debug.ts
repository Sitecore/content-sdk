import { debugNamespace, debugModule } from '@sitecore-content-sdk/core';

export const PERSONALIZE_NAMESPACE = 'personalize';
/**
 * Debug module for personalize package
 * @public
 */
export const debug = {
  personalize: debugModule(`${debugNamespace}:${PERSONALIZE_NAMESPACE}`),
};

