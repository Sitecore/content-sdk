import { BaseAppArgs } from './args';

export type InitializerResults = {
  appName: string;
  nextSteps?: string;
};

/**
 * Initializer base type
 */
export interface Initializer {
  /**
   * The name for the app
   */
  appName: string;
  /**
   * Entrypoint for initializer
   * @param {BaseArgs} args CLI arguments
   */
  init: (args: BaseAppArgs) => Promise<InitializerResults>;
}
