import { Question } from 'inquirer';
import path from 'path';
import { type ScaffoldInitData } from '@sitecore-content-sdk/cli/scaffolding';
import { nextjsPrompts, readVersions } from './common';

export const NextjsInit: ScaffoldInitData<Question> = {
  name: 'nextjs',
  prompts: [...nextjsPrompts('content-sdk-nextjs')],
  templatePath: path.resolve(__dirname, '../templates/nextjs'),
  versions: readVersions(),
};

