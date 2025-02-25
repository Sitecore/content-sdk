import { RetryStrategy, GenericGraphQLClientError } from './models';

/**
 * Represents a default retry strategy for handling retry attempts in case of specific HTTP status codes.
 * This class implements the RetryStrategy interface and provides methods to determine whether a request
 * should be retried and calculates the delay before the next retry attempt.
 */
export class DefaultRetryStrategy implements RetryStrategy {
  private statusCodes: number[];
  private errorCodes: string[];
  private factor: number;

  /**
   * @param {object} options Configurable options for retry mechanism.
   * @param {number[]} [options.statusCodes] HTTP status codes to trigger retries on. Default is [429].
   * @param {string[]} [options.errorCodes] Node error codes to trigger retries. Default is ['ECONNRESET', 'ETIMEDOUT', 'EPROTO'].
   * @param {number} [options.factor] Factor by which the delay increases with each retry attempt. Default is 2.
   */
  constructor(options: { statusCodes?: number[]; errorCodes?: string[]; factor?: number } = {}) {
    this.statusCodes = options.statusCodes || [429];
    this.errorCodes = options.errorCodes || ['ECONNRESET', 'ETIMEDOUT', 'EPROTO'];
    this.factor = options.factor || 2;
  }

  shouldRetry(error: GenericGraphQLClientError, attempt: number, retries: number): boolean {
    const isStatusCodeError =
      error.response?.status !== undefined && this.statusCodes.includes(error.response.status);
    const isNodeErrorCode = error.code !== undefined && this.errorCodes.includes(error.code);
    return retries > 0 && attempt <= retries && (isStatusCodeError || isNodeErrorCode);
  }

  getDelay(error: GenericGraphQLClientError, attempt: number): number {
    const rawHeaders = error.response?.headers as Headers;
    const retryAfterHeader = rawHeaders?.get('Retry-After');

    if (
      retryAfterHeader !== null &&
      retryAfterHeader !== undefined &&
      retryAfterHeader.trim() !== ''
    ) {
      const delaySeconds = Number.parseFloat(retryAfterHeader);
      return delaySeconds * 1000;
    } else {
      return Math.pow(this.factor, attempt - 1) * 1000;
    }
  }
}
