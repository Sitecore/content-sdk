import { DistinctQuestion } from 'inquirer';
import { BaseAppArgs } from './args';
import { BaseAppAnswer } from './prompts';
import { CsdkVersions } from '../processes/transform';

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
   * Renders a template folder to the destination using the provided package versions.
   */
  transform: (templatePath: string, args: BaseAppArgs, versions: CsdkVersions) => Promise<void>;
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
