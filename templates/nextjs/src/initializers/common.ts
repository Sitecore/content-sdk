import fs from 'fs';
import { DistinctQuestion } from 'inquirer';
import path from 'path';

/**
 * Content SDK package versions stamped into the generated app. Read from this
 * package's own devDependencies so the scaffolded versions have a single source
 * of truth and travel with the exported initializer (create-content-sdk-app reads
 * them from here rather than resolving them itself).
 * @returns {{ [key: string]: string }} map of `@sitecore-content-sdk/*` package names to versions
 */
export const readVersions = (): { [key: string]: string } => {
  const pkg = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../package.json'), 'utf8'));
  const devDependencies = (pkg.devDependencies || {}) as { [key: string]: string };
  const versions: { [key: string]: string } = {};
  for (const [name, version] of Object.entries(devDependencies)) {
    if (name.startsWith('@sitecore-content-sdk')) {
      versions[name] = version;
    }
  }
  return versions;
};

const PRERENDER_CHOICES = ['SSG', 'SSR'];
const DEFAULT_PRERENDER = 'SSG';

export const nextjsPrompts: DistinctQuestion[] = [
  {
    type: 'list',
    name: 'prerender',
    message: 'How would you like to prerender your application?',
    choices: PRERENDER_CHOICES,
    default: DEFAULT_PRERENDER,
    when: (answers: { [key: string]: unknown }): boolean => {
      if (answers.yes && !answers.prerender) {
        answers.prerender = DEFAULT_PRERENDER;
      }
      return !answers.prerender;
    },
  },
];
