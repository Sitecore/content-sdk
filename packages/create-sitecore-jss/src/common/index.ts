export { ClientAppArgs, BaseArgs } from './args/base';

export { ClientAppAnswer, clientAppPrompts, DEFAULT_APPNAME } from './prompts/base';
export {
  isDevEnvironment,
  openJsonFile,
  writeJsonFile,
  getAllTemplates,
  saveConfiguration,
  removeFile,
} from './utils/helpers';

export { Initializer } from './Initializer';

export { transform } from './processes/transform';
export { nextSteps } from './processes/next';
export { installPackages, lintFix } from './processes/install';
