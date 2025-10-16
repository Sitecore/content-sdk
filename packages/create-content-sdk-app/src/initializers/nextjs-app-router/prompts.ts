import { QuestionCollection } from 'inquirer';
import { baseAppPrompts, BaseAppAnswer } from '../../common';

export enum Prerender {
  SSG = 'SSG',
  SSR = 'SSR',
}

export enum AppRouterVariant {
  BASIC = 'basic',
  SKATEPARK = 'skatepark',
}

export type NextjsAppRouterAnswer = BaseAppAnswer & {
  prerender: Prerender;
  variant: AppRouterVariant;
};

const DEFAULT_PRERENDER = Prerender.SSG;
const DEFAULT_VARIANT = AppRouterVariant.BASIC;

export const prompts: QuestionCollection<NextjsAppRouterAnswer> = [
  ...baseAppPrompts,
  {
    type: 'list',
    name: 'variant',
    message: 'Which App Router template would you like to use?',
    choices: [
      {
        name: 'Basic - Minimal starter template',
        value: AppRouterVariant.BASIC,
      },
      {
        name: 'Skatepark - Complete sample with all components',
        value: AppRouterVariant.SKATEPARK,
      },
    ],
    default: DEFAULT_VARIANT,
    when: (answers: NextjsAppRouterAnswer): boolean => {
      if (answers.yes && !answers.variant) {
        answers.variant = DEFAULT_VARIANT;
      }
      return !answers.variant;
    },
  },
  {
    type: 'list',
    name: 'prerender',
    message: 'How would you like to prerender your application?',
    choices: Object.values(Prerender),
    default: DEFAULT_PRERENDER,
    when: (answers: NextjsAppRouterAnswer): boolean => {
      if (answers.yes && !answers.prerender) {
        answers.prerender = DEFAULT_PRERENDER;
      }
      return !answers.prerender;
    },
  },
];
