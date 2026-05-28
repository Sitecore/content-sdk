import { ProxiesContextMapValue } from './types';

/**
 * Type guard to check if the proxy execution was successful
 * @template SuccessfulProxyType - The type of the successful proxy execution information
 * @template T - The type of the proxy execution information, which can be either successful or failed execution information
 * @param {T} info - Information about executed proxy to be stored in the context
 * @returns Type guard to check if the proxy execution was successful
 * @public
 */
export function isSuccessfulProxyExecution<
  SuccessfulProxyType = unknown,
  T extends ProxiesContextMapValue | undefined = ProxiesContextMapValue | undefined
>(info: T): info is T & SuccessfulProxyType {
  return info?.executedSuccessfully === true;
}
