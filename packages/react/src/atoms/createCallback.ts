import type { CallbackMetadata, CallbackParamsInput, InferCallbackArgs } from './types';

/**
 * Schema input for createCallback. Param names are the keys of the params record,
 * and impl receives a single object argument typed from those keys.
 * @public
 */
export type CallbackSchemaInput<P extends CallbackParamsInput> = {
  /** Human-readable summary for the callback */
  description: string;
  /** Record of param names to Zod types. Keys define the param names. */
  params: P;
  /** Implementation of the callback. Receives a single object with keys matching params. */
  callbackFn: (args: InferCallbackArgs<P>) => void;
};

/**
 * Create a callback descriptor. The params record keys define the parameter names,
 * and TypeScript enforces that impl's argument object matches those keys and types.
 * @param {string} name - The unique identifier for this callback
 * @param {CallbackSchemaInput<P>} schema - The schema that defines the callback's description and params
 * @returns {CallbackMetadata} CallbackMetadata with params as a CallbackParam array
 * @public
 */
export function createCallback<P extends CallbackParamsInput>(
  name: string,
  schema: CallbackSchemaInput<P>
): CallbackMetadata {
  return {
    name,
    ...schema,
  };
}
