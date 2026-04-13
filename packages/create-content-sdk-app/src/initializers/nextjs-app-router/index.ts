import path from 'path';
import inquirer from 'inquirer';
import { prompts, NextjsAppRouterAnswer } from './prompts';
import { Initializer, transform } from '../../common';
import { NextjsAppRouterArgs } from './args';
import { SdkInstalledEventInit } from '../../telemetry/events';
import { TelemetryService } from '@sitecore-content-sdk/core/node-tools';

export default class NextjsAppRouterInitializer implements Initializer {
  async init(args: NextjsAppRouterArgs) {
    const answers = await inquirer.prompt<NextjsAppRouterAnswer>(prompts, args);
    const templatePath = path.resolve(__dirname, '../../templates/nextjs-app-router');

    await transform(templatePath, { ...args, ...answers });

    const sdkEvent = SdkInstalledEventInit('nextjs-app-router');
    TelemetryService.dispatch(sdkEvent);

    const response = {};
    return response;
  }
}
