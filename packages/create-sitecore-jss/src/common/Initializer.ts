import { BaseArgs } from './args/base';
export type InitializerResults = {
  appName: string;
  initializers?: string[];
  nextSteps?: string[];
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
