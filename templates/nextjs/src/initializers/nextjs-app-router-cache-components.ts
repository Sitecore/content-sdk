import { Question } from 'inquirer';
import path from 'path';
import { type ScaffoldInitData } from '@sitecore-content-sdk/cli/scaffolding';
import { nextjsPrompts, readVersions } from './common';

export const NextjsAppRouterCacheComponentsInit: ScaffoldInitData<Question> = {
  name: 'nextjs-app-router-cache-components',
  prompts: nextjsPrompts,
  templatePath: path.resolve(__dirname, '../templates/nextjs-app-router-cache-components'),
  versions: readVersions(),
};

