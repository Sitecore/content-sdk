import path from 'path';
import inquirer from 'inquirer';
import { prompts, NextjsAppRouterAnswer } from './prompts';
import { Initializer, InitContext } from '../../scaffolding';
import { NextjsAppRouterArgs } from './args';

export default class NextjsAppRouterInitializer implements Initializer {
  async init(args: NextjsAppRouterArgs, ctx: InitContext) {
    const answers = await inquirer.prompt<NextjsAppRouterAnswer>(
      [...ctx.baseAppPrompts, ...prompts],
      args
    );
    const templatePath = path.resolve(__dirname, '../../templates/nextjs-app-router');

    await ctx.transform(templatePath, { ...args, ...answers });

    const response = {};
    return response;
  }
}
