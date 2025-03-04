import path from 'path';
import { scaffoldComponent } from '@sitecore-content-sdk/core/tools';

const tsx = require('tsx/cjs/api');

/* eslint-disable prettier/prettier */
export const command = 'scaffold';

export const describe = 'Scaffold a new component';

export const builder = {
  config: {
    requiresArg: true,
    type: 'string',
    describe: 'Path to the Sitecore cli config',
    default: './sitecore.cli.config.ts',
  },
  componentName: {
    requiresArg: true,
    type: 'string',
    describe: 'Name of the component to scaffold',
  },
  templateName: {
    requiresArg: false,
    type: 'string',
    describe: 'Name of the template that will be used to scaffold the component.',
  },
  byoc: {
    requiresArgs: false,
    type: 'boolean',
    describe: 'If true, scaffolds a byoc component.',
    default: false,
  },
};

/**
 * Handler for the scaffold command.
 * @param {any} argv - The arguments passed to the command.
 */
export function handler(argv: any) {
  if (!argv.componentName) {
    throw 'Component name was not passed. Usage: scs scaffold <ComponentName>';
  }

  const nameParamFormat = new RegExp(/^((?:[\w\-]+\/)*)([A-Z][\w-]+)$/);
  const regExResult = nameParamFormat.exec(argv.componentName);

  if (regExResult === null) {
    throw `Component name should start with an uppercase letter and contain only letters, numbers,
dashes, or underscores. If specifying a path, it must be relative to src/components`;
  }

  const componentPath = regExResult[1];
  const componentName = regExResult[2];
  const filename = `${componentName}.tsx`;
  const componentRoot = componentPath.startsWith('src/') ? '' : 'src/components';
  const outputFilePath = path.join(componentRoot, componentPath, filename);
  const cliConfig = tsx.require(path.resolve(process.cwd(), argv.config), __filename);

  scaffoldComponent(
    outputFilePath,
    componentName,
    argv.templateName,
    cliConfig.default.scaffold.templates,
    argv.byoc
  );
}
