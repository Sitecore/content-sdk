import { BaseAppArgs } from './args';

export type InitializerResults = {
  nextSteps?: string;
};

/**
 * Initializer base type
 */
export interface Initializer {
  /**
   * Entrypoint for initializer
   * @param {BaseArgs} args CLI arguments
   */
  init: (args: BaseAppArgs) => Promise<InitializerResults>;
}
