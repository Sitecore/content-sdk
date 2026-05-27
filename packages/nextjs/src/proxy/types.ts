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

