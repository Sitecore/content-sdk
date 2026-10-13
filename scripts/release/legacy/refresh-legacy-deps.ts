/**
 * Legacy CI: re-resolves the Content SDK packages a legacy branch takes from npm to the newest
 * version in range (`yarn up -R`, manifests unchanged), so the product builds and tests against what
 * its consumers install. A legacy branch holds only its product's packages (P1); `yarn.lock` pins
 * the shared ones as of the last lockfile write, while consumers float to dev's latest in-range
 * releases. CI only: the refreshed lockfile is not committed.
 *
 * Usage: tsx ./scripts/release/legacy/refresh-legacy-deps.ts
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { execFileSync } from 'child_process';
import { getPackages } from '@manypkg/get-packages';
import { runMain } from '../../changesets/utils';

const SDK_SCOPE = '@sitecore-content-sdk/';
const DEPENDENCY_TYPES = ['dependencies', 'devDependencies', 'peerDependencies'] as const;

interface PackageLike {
  packageJson: { name: string } & Partial<
    Record<(typeof DEPENDENCY_TYPES)[number], Record<string, string>>
  >;
}

/** Content SDK packages the workspace depends on that aren't workspace packages (sorted). */
export function npmResolvedSdkDeps(packages: PackageLike[]): string[] {
  const workspace = new Set(packages.map((pkg) => pkg.packageJson.name));
  const deps = new Set(
    packages.flatMap((pkg) =>
      DEPENDENCY_TYPES.flatMap((type) => Object.keys(pkg.packageJson[type] ?? {}))
    )
  );
  return [...deps].filter((name) => name.startsWith(SDK_SCOPE) && !workspace.has(name)).sort();
}

async function main(): Promise<void> {
  const { packages } = await getPackages(process.cwd());
  const names = npmResolvedSdkDeps(packages);
  if (names.length === 0) {
    console.log('No Content SDK packages resolve from npm. Nothing to refresh.');
    return;
  }
  console.log(`Refreshing to the newest in-range versions: ${names.join(', ')}`);
  execFileSync('yarn', ['up', '-R', ...names], {
    stdio: 'inherit',
    env: { ...process.env, YARN_ENABLE_IMMUTABLE_INSTALLS: 'false' },
    shell: process.platform === 'win32',
  });
}

runMain(import.meta.url, main);
