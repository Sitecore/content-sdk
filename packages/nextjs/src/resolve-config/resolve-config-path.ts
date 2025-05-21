/* eslint-disable jsdoc/require-jsdoc */
import fs from 'fs';
import path from 'path';

export function resolveSitecoreConfigPath(cwd: string) {
  return resolveConfigPath(['./sitecore.config.ts'], cwd);
}

export function resolveSitecoreSitesPath(cwd: string) {
  return resolveConfigPath(['./.sitecore/sites.json'], cwd);
}

function resolveConfigPath(filePaths: string[], cwd: string) {
  for (const candidate of filePaths) {
    const fullPath = path.resolve(cwd, candidate);
    if (fs.existsSync(fullPath)) {
      return fullPath;
    }
  }

  throw new Error('Could not locate Sitecore configuration module.');
}
