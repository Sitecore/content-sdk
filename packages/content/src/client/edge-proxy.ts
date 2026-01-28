import { constants } from '@sitecore-content-sdk/core';
import { normalizeUrl } from '@sitecore-content-sdk/core/tools';

const { SITECORE_EDGE_URL_DEFAULT } = constants;

/**
 * Generates a URL for accessing Sitecore Edge Platform Content using the provided endpoint and context ID.
 * @param {string} [sitecoreEdgeUrl] - The base endpoint URL for the Edge Platform. Default is https://edge-platform.sitecorecloud.io
 * @returns {string} The complete URL for accessing content through the Edge Platform.
 * @public
 */
export const getEdgeProxyContentUrl = (sitecoreEdgeUrl = SITECORE_EDGE_URL_DEFAULT) =>
  `${normalizeUrl(sitecoreEdgeUrl)}/v1/content/api/graphql/v1`;

/**
 * Generates a URL for accessing Sitecore Edge Platform Forms using the provided form ID and context ID.
 * @param {string} sitecoreEdgeContextId - The unique context id.
 * @param {string} formId - The unique form id.
 * @param {string} [sitecoreEdgeUrl] - The base endpoint URL for the Edge Platform. Default is https://edge-platform.sitecorecloud.io
 * @returns {string} The complete URL for accessing forms through the Edge Platform.
 * @internal
 */
export const getEdgeProxyFormsUrl = (
  sitecoreEdgeContextId: string,
  formId: string,
  sitecoreEdgeUrl = SITECORE_EDGE_URL_DEFAULT
) =>
  `${normalizeUrl(
    sitecoreEdgeUrl
  )}/v1/forms/publisher/${formId}?sitecoreContextId=${sitecoreEdgeContextId}`;
