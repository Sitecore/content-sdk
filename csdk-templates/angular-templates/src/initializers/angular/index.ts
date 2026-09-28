import path from 'path';
import inquirer from 'inquirer';
import { Initializer, InitContext } from '../../scaffolding';
import { AngularArgs } from './args';
import { AngularAnswer, prompts } from './prompts';

export default class AngularInitializer implements Initializer {
  async init(args: AngularArgs, ctx: InitContext) {
    const answers = await inquirer.prompt<AngularAnswer>([...ctx.baseAppPrompts, ...prompts], args);
    const templatePath = path.resolve(__dirname, '../../templates/angular');

    await ctx.transform(templatePath, { ...args, ...answers });

    const response = {};
    return response;
  }
}
