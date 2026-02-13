import { normalizeUrl, resolveEdgeUrl } from '@sitecore-content-sdk/core/tools';

/**
 * Resolves the base Edge URL: uses provided value (from config) or falls back to resolveEdgeUrl.
 * Normalizes trailing slash when a value is provided.
 * @internal
 */
const getBaseEdgeUrl = (sitecoreEdgeUrl?: string): string =>
  sitecoreEdgeUrl ? normalizeUrl(sitecoreEdgeUrl) : resolveEdgeUrl();

/**
 * Generates a URL for accessing Sitecore Edge Platform Content using the provided endpoint and context ID.
 * @param {string} [sitecoreEdgeUrl] - The base endpoint URL for the Edge Platform (resolved at config level).
 *   When not provided, resolves from env vars as fallback.
 * @returns {string} The complete URL for accessing content through the Edge Platform.
 * @public
 */
export const getEdgeProxyContentUrl = (sitecoreEdgeUrl?: string) =>
  `${getBaseEdgeUrl(sitecoreEdgeUrl)}/v1/content/api/graphql/v1`;

/**
 * Generates a URL for accessing Sitecore Edge Platform Forms using the provided form ID and context ID.
 * @param {string} sitecoreEdgeContextId - The unique context id.
 * @param {string} formId - The unique form id.
 * @param {string} [sitecoreEdgeUrl] - The base endpoint URL for the Edge Platform (resolved at config level).
 *   When not provided, resolves from env vars as fallback.
 * @returns {string} The complete URL for accessing forms through the Edge Platform.
 * @internal
 */
export const getEdgeProxyFormsUrl = (
  sitecoreEdgeContextId: string,
  formId: string,
  sitecoreEdgeUrl?: string
) =>
  `${getBaseEdgeUrl(sitecoreEdgeUrl)}/v1/forms/publisher/${formId}?sitecoreContextId=${sitecoreEdgeContextId}`;
