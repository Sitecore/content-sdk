import debug from '../debug';
import {
  isPersonalizeExecutionResult,
  mergeExecutionTokenResults,
  TokenMap,
} from './token-map';

/**
 * Runs Personalize executions concurrently, then merges tokens in contractual
 * execution order. One execution failure does not reject the others.
 * Results without a valid selected variant do not contribute tokens.
 * @param {Array<{ variantIds: string[] }>} executions Executions in contractual order
 * @param {(execution: T) => Promise<unknown>} execute Execution runner
 * @returns {Promise<{ identifiedVariantIds: string[]; tokens: TokenMap }>} Identified variants and merged tokens
 * @internal
 */
export async function collectPersonalizeExecutionTokens<T extends { variantIds: string[] }>(
  executions: T[],
  execute: (execution: T) => Promise<unknown>
): Promise<{ identifiedVariantIds: string[]; tokens: TokenMap }> {
  const results = await Promise.all(
    executions.map((execution) =>
      Promise.resolve()
        .then(() => execute(execution))
        .catch(() => {
          debug.personalize('personalize execution failed');
          return null;
        })
    )
  );

  const identifiedVariantIds: string[] = [];
  const aligned = results.map((result, index) => {
    if (!isPersonalizeExecutionResult(result) || !result.variantId) {
      return null;
    }
    if (!executions[index].variantIds.includes(result.variantId)) {
      debug.personalize('invalid variant %s', result.variantId);
      return null;
    }
    identifiedVariantIds.push(result.variantId);
    return result;
  });

  return {
    identifiedVariantIds,
    tokens: mergeExecutionTokenResults(executions, aligned),
  };
}
