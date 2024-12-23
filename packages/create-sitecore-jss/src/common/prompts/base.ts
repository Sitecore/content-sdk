import chalk from 'chalk';
import { Answers, DistinctQuestion } from 'inquirer';

/**
 * Set of CLI answers for the client-side app
 */
export type ClientAppAnswer = Answers & {
  /**
   * Application name
   */
  appName: string;
};

/**
 * Default app name for the new app
 */
export const DEFAULT_APPNAME = 'sitecore-jss-app';

/**
 * Set of CLI prompts for the client-side app
 */
export const clientAppPrompts: DistinctQuestion<ClientAppAnswer>[] = [
  {
    type: 'input',
    name: 'appName',
    message: 'What is the name of your app?',
    default: DEFAULT_APPNAME,
    validate: (input: string): boolean => {
      if (!/^[a-z\-_.]+$/.test(input)) {
        console.error(
          chalk.red(
            `${input} is not a valid name; you may use lowercase letters, hyphens, and underscores only.`
          )
        );
        return false;
      }
      return true;
    },
    when: (answers: ClientAppAnswer): boolean => {
      if (answers.yes && !answers.appName) {
        answers.appName = DEFAULT_APPNAME;
      }
      return !answers.appName;
    },
  },
];
