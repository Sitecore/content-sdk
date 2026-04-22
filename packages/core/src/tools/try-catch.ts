/**
 * Executes a sync or async function and returns a tuple of [result, error].
 * If the function returns a Promise, the result is a Promise resolving to the tuple.
 * On success: returns [result, null]. On error: returns [fallback, Error].
 * @param {() => CallbackResult} fn - The function to execute.
 * @param {Fallback} [fallback] - Optional fallback value returned as the result when an error occurs.
 * @returns {Result} A tuple of [result, error].
 * @public
 */
export function tryCatch<
  CallbackResult,
  Fallback = undefined,
  Result = CallbackResult extends Promise<infer U>
    ? Promise<[U, null] | [Fallback, Error]>
    : [CallbackResult, null] | [Fallback, Error]
>(fn: () => CallbackResult, fallback?: Fallback): Result {
  const onError = (err: unknown): [Fallback, Error] => {
    const error = err instanceof Error ? err : new Error(String(err));

    return [fallback as Fallback, error];
  };

  try {
    const result = fn();

    if (result instanceof Promise)
      return result.then((value) => [value, null]).catch(onError) as Result;

    return [result, null] as Result;
  } catch (err) {
    return onError(err) as Result;
  }
}
