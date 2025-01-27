import { BaseArgs } from './args';

export type InitializerResults = {
  appName: string;
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
  init: (args: BaseArgs) => Promise<InitializerResults>;
}
