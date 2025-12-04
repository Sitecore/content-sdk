import { generateV4UUID } from '@sitecore-content-sdk/utils';

/**
 * A function that generates a correlation id
 *
 * @returns A correlation id string
 */
export function generateCorrelationId(): string {
  return generateV4UUID().replace(/-/g, '');
}
