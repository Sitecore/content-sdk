import { z } from 'zod';
import { CallbackMetadata } from './types';
import { CallbackInfo } from '@sitecore-content-sdk/content/editing';

/**
 * Serializes the provided callbacks metadata array into a format suitable for broadcasting via postMessage to the host application
 * @param {CallbackMetadata[]} callbacks - the callbacks to be serialized
 * @returns {Record<string, CallbackInfo>} the serialized callbacks
 * @internal
 */
export const serializeCallbacks = (callbacks: CallbackMetadata[]): Record<string, CallbackInfo> => {
  const callbacksInfo: Record<string, CallbackInfo> = {};

  callbacks.forEach((callback) => {
    const callbackInfo: CallbackInfo = {
      description: callback.description,
    };

    if (callback.params && Object.keys(callback.params).length > 0) {
      const shape: Record<string, z.ZodType> = {};
      for (const [argName, p] of Object.entries(callback.params)) {
        shape[argName] = p.type.meta({ description: p.description });
      }
      callbackInfo.params = z.toJSONSchema(z.object(shape), {
        target: 'draft-7',
      });
    }

    callbacksInfo[callback.name] = callbackInfo;
  });

  return callbacksInfo;
};
