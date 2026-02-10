import { ERROR_MESSAGES } from "../constants";

/**
 * A helper to assign timeouts to fetch or other promises
 * Useful in nextjs middleware until fetch.signal is fully supported by Vercel edge functions
 */
export default class TimeoutPromise {
  timeoutId: NodeJS.Timeout | undefined;

  constructor(private timeout: number) {
    this.timeoutId = undefined;
  }

  /**
   * Creates a timeout promise
   */
  get start(): Promise<unknown> {
    return new Promise((_, reject) => {
      if (!Number.isInteger(this.timeout) || this.timeout < 0) throw new Error(ERROR_MESSAGES.IV_0006);

      this.timeoutId = setTimeout(() => {
        const abortError = new Error(ERROR_MESSAGES.IE_0002);
        abortError.name = 'AbortError';
        reject(abortError);
      }, this.timeout);
    });
  }

  /**
   * Clears the timeout from timeout promise
   */
  clear() {
    this.timeoutId && clearTimeout(this.timeoutId);
  }
}
