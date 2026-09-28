import { DistinctQuestion } from 'inquirer';
import { BaseAppArgs } from './args';
import { BaseAppAnswer } from './prompts';

export type InitializerResults = {
  nextSteps?: string;
};

/**
 * Shared utilities injected by create-content-sdk-app into a template package's
 * initializer at runtime. Template packages implement `Initializer` but do not
 * depend on create-content-sdk-app; they receive the rendering pipeline here.
 */
export type InitContext = {
  /**
   * Renders a template folder to the destination. The Content SDK package
   * versions are resolved and bound by create-content-sdk-app from the template
   * package's own package.json, so initializers do not pass them.
   */
  transform: (templatePath: string, args: BaseAppArgs) => Promise<void>;
  /**
   * Base prompts contributed by the CLI, prepended to each initializer's prompts.
   */
  baseAppPrompts: DistinctQuestion<BaseAppAnswer>[];
};

/**
 * Initializer base type
 */
export interface Initializer {
  /**
   * Entrypoint for initializer
   * @param {BaseAppArgs} args CLI arguments
   * @param {InitContext} ctx shared utilities injected by create-content-sdk-app
   */
  init: (args: BaseAppArgs, ctx: InitContext) => Promise<InitializerResults>;
}
