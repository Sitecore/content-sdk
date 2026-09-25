import path from 'path';
import inquirer from 'inquirer';
import { prompts, NextjsAnswer } from './prompts';
import { Initializer, InitContext } from '../../scaffolding';
import { getVersions } from '../../versions';
import { NextjsArgs } from './args';

export default class NextjsInitializer implements Initializer {
  async init(args: NextjsArgs, ctx: InitContext) {
    const answers = await inquirer.prompt<NextjsAnswer>([...ctx.baseAppPrompts, ...prompts], args);
    const templatePath = path.resolve(__dirname, '../../templates/nextjs');

    await ctx.transform(templatePath, { ...args, ...answers }, getVersions());

    const response = {};
    return response;
  }
}
