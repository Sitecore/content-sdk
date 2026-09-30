import path from 'path';
import inquirer from 'inquirer';
import { prompts, NextjsAppRouterAnswer } from '../nextjs-app-router/prompts';
import { Initializer, InitContext } from '../../scaffolding';
import { NextjsAppRouterCacheComponentsArgs } from './args';

export default class NextjsAppRouterCacheComponentsInitializer implements Initializer {
  async init(args: NextjsAppRouterCacheComponentsArgs, ctx: InitContext) {
    const answers = await inquirer.prompt<NextjsAppRouterAnswer>(
      [...ctx.baseAppPrompts, ...prompts],
      args
    );
    const templatePath = path.resolve(__dirname, '../../templates/nextjs-app-router-cache-components');

    await ctx.transform(templatePath, { ...args, ...answers });

    return {};
  }
}
