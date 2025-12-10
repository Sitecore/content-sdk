import { generateV4UUID } from '@sitecore-content-sdk/utils';

/**
 * Generates a correlation id.
 * @returns {string} A correlation id string.
 */
export function generateCorrelationId(): string {
  return generateV4UUID().replace(/-/g, '');
}
