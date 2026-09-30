import fs from 'fs';
import path from 'path';
import { CsdkVersions } from '../processes/transform';

/**
 * Retrieves Content SDK package versions from a template package's devDependencies.
 *
 * Reads the given template package's `package.json` and extracts all
 * `@sitecore-content-sdk` dependencies with their versions. create-content-sdk-app
 * resolves the template package's location and calls this so version resolution
 * lives in one place rather than being duplicated inside each template package.
 * @param {string} packageDir directory containing the template package's package.json
 * @returns {CsdkVersions} a dictionary of Content SDK package names to their versions
 */
export const getVersions = (packageDir: string): CsdkVersions => {
  const packageJson = JSON.parse(fs.readFileSync(path.join(packageDir, 'package.json'), 'utf8'));
  const devDependencies = (packageJson.devDependencies || {}) as { [key: string]: string };
  const csdkDependencies: CsdkVersions = {};

  for (const [name, version] of Object.entries(devDependencies)) {
    if (name.startsWith('@sitecore-content-sdk')) {
      csdkDependencies[name] = version;
    }
  }

  return csdkDependencies;
};

