import { DistinctQuestion } from 'inquirer';
import { BaseAppArgs } from './args';
import { BaseAppAnswer } from './prompts';

/**
 * Internal context assembled by create-content-sdk-app to drive scaffolding: the
 * rendering pipeline bound to a template package's versions plus the CLI's base
 * prompts. Template packages contribute data only (`ScaffoldInitData`); the CLI
 * owns this pipeline.
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
