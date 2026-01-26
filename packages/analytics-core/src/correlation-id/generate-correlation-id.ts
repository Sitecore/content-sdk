import { generateV4UUID } from '../utils';

/**
 * Generates a correlation id.
 * @returns {string} A correlation id string.
 */
export function generateCorrelationId(): string {
  return generateV4UUID().replace(/-/g, '');
}
