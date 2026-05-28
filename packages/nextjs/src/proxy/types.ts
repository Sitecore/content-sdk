/**
 * Information about executed proxy to be stored in the context
 * Used for describing failed execution with error information
 * @public
 */
export interface FailedProxyExecution {
  executedSuccessfully: false;
  error: unknown;
}

/**
 * Information about executed proxy to be stored in the context
 * Used for describing successful execution
 * @public
 */
export interface SuccessfulProxyExecution {
  executedSuccessfully: true;
  error: null;
}

/**
 * Information about executed proxy to be stored in the context
 * @public
 */
export type ProxiesContextMapValue = FailedProxyExecution | SuccessfulProxyExecution;

/**
 * The context object that can be used by proxies to share information between each other or to return information about executed proxies. It is a Map with proxy name as key and an object with any information as value.
 * @public
 */
export type ProxiesContext = Map<string, ProxiesContextMapValue>;
