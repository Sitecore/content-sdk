import path from 'path';
import inquirer from 'inquirer';
import { prompts, NextjsAnswer } from './prompts';
import { Initializer, transform } from '../../common';
import { NextjsArgs } from './args';
import { SdkInstalledEventInit } from '../../telemetry/events';
import { TelemetryService } from '@sitecore-content-sdk/core/node-tools';

export default class NextjsInitializer implements Initializer {
  async init(args: NextjsArgs) {
    const answers = await inquirer.prompt<NextjsAnswer>(prompts, args);
    const templatePath = path.resolve(__dirname, '../../templates/nextjs');

    const merged = { ...args, ...answers };
    await transform(templatePath, merged);

    const sdkEvent = SdkInstalledEventInit('nextjs', merged.destination as string);
    TelemetryService.dispatch(sdkEvent);

    const response = {};
    return response;
  }
}
