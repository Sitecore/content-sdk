import { constants } from '@sitecore-content-sdk/core';
import { normalizeUrl } from '@sitecore-content-sdk/core/tools';

/**
 * Resolves the base Edge URL from config. Caller should pass the resolved Edge URL from config.
 * @param {string} [sitecoreEdgeUrl] - The base Edge URL from config. Defaults to platform URL.
 * @internal
 */
const getBaseEdgeUrl = (
  sitecoreEdgeUrl: string = constants.SITECORE_EXPERIENCE_EDGE_URL_DEFAULT
): string => normalizeUrl(sitecoreEdgeUrl);

/**
 * Generates a URL for accessing Sitecore Edge Platform Content using the provided endpoint and context ID.
 * @param {string} [sitecoreEdgeUrl] - The base endpoint URL for the Edge Platform (resolved at config level). Defaults to platform URL.
 * @returns {string} The complete URL for accessing content through the Edge Platform.
 * @public
 */
export const getEdgeProxyContentUrl = (
  sitecoreEdgeUrl: string = constants.SITECORE_EXPERIENCE_EDGE_URL_DEFAULT
) => `${getBaseEdgeUrl(sitecoreEdgeUrl)}/v1/content/api/graphql/v1`;

/**
 * Generates a URL for accessing Sitecore Edge Platform Forms using the provided form ID and context ID.
 * @param {string} sitecoreEdgeContextId - The unique context id.
 * @param {string} formId - The unique form id.
 * @param {string} [sitecoreEdgeUrl] - The base endpoint URL for the Edge Platform (resolved at config level). Defaults to platform URL.
 * @returns {string} The complete URL for accessing forms through the Edge Platform.
 * @internal
 */
export const getEdgeProxyFormsUrl = (
  sitecoreEdgeContextId: string,
  formId: string,
  sitecoreEdgeUrl: string = constants.SITECORE_EXPERIENCE_EDGE_URL_DEFAULT
) =>
  `${getBaseEdgeUrl(sitecoreEdgeUrl)}/v1/forms/publisher/${formId}?sitecoreContextId=${sitecoreEdgeContextId}`;
