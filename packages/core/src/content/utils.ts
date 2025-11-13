import { normalizeUrl } from '../utils/normalize-url';

/**
 * Get the Content graphql endpoint url
 * @param {object} params Parameters
 * @param {string} [params.url] Content base graphql endpoint url
 * @param {string} params.tenant Tenant name
 * @param {string} params.environment Environment name
 * @param {boolean} params.preview Indicates if preview mode is enabled
 * @returns {string} Content graphql endpoint url
 */
export function getContentUrl({
  url = 'https://edge-platform.sitecorecloud.io',
  tenant,
  environment,
  preview,
}: {
  url?: string;
  tenant: string;
  environment: string;
  preview: boolean;
}) {
  return `${normalizeUrl(url)}/cs/api/v2/graphql/${tenant}/${environment}?preview=${preview}`;
}
