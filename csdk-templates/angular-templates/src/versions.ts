import fs from 'fs';
import path from 'path';

/**
 * Retrieves Content SDK package versions from this package's devDependencies.
 *
 * Reads this package's own package.json and extracts all `@sitecore-content-sdk`
 * dependencies with their versions.
 *
 * When this package itself has a pre-release suffix (e.g., `-canary`, `-beta`),
 * any pre-release dependencies will have their range prefixes (`^` or `~`)
 * stripped to ensure exact version matching. Stable dependencies retain their
 * original version prefixes.
 *
 * This mirrors the version-resolution logic that previously lived in
 * create-content-sdk-app, now sourced from this template package.
 * @returns A dictionary of Content SDK package names to their versions
 */
export const getVersions = (): { [key: string]: string } => {
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8')
  );
  const packageVersion = packageJson.version as string;
  const devDependencies = (packageJson.devDependencies || {}) as { [key: string]: string };
  const csdkDependencies: { [key: string]: string } = {};

  const isPackagePreRelease = packageVersion.includes('-');

  for (const [name, version] of Object.entries(devDependencies)) {
    if (name.startsWith('@sitecore-content-sdk')) {
      const isDependencyPreRelease = version.includes('-');
      const shouldStripPrefix = isPackagePreRelease && isDependencyPreRelease;
      const resolvedVersion = shouldStripPrefix ? version.replace(/^[\^~]/, '') : version;
      csdkDependencies[name] = resolvedVersion;
    }
  }

  return csdkDependencies;
};
