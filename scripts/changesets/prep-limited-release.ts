/**
 * Configures `.changeset/config.json` for a limited release.
 *
 * Given the set of packages that SHOULD be released, every other publishable
 * (non-private) workspace package is added to the changesets `ignore` list so
 * that `changeset version` / publish only touches the selected packages.
 * See https://changesets.dev/guide/config#ignore
 *
 * Selected packages are read from (in order of precedence):
 *   --select "@scope/a,@scope/b"   (comma/space/newline separated)
 *   RELEASE_PACKAGES env var       (comma/space/newline separated)
 *
 * Usage:
 *   tsx ./scripts/changesets/prep-limited-release.ts --select "@sitecore-content-sdk/core" [--dry-run]
 *   RELEASE_PACKAGES="@sitecore-content-sdk/core @sitecore-content-sdk/react" tsx ./scripts/changesets/prep-limited-release.ts
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */

import { readFileSync, realpathSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { getPackages } from '@manypkg/get-packages';

const CONFIG_RELATIVE_PATH = '.changeset/config.json';

export function parseList(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/[\s,]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function getSelectedPackages(): string[] {
  const flagIndex = process.argv.indexOf('--select');
  const fromFlag = flagIndex !== -1 ? process.argv[flagIndex + 1] : undefined;
  const raw = fromFlag ?? process.env.RELEASE_PACKAGES;
  return Array.from(new Set(parseList(raw)));
}

/**
 * Computes the changesets `ignore` list for a limited release: every publishable package that was
 * not selected, sorted. Throws if nothing is selected or if a selected name is not publishable.
 */
export function resolveIgnoreList(publishable: string[], selected: string[]): string[] {
  if (selected.length === 0) {
    throw new Error(
      'No packages selected. Pass --select "@sitecore-content-sdk/*" and other packages or set RELEASE_PACKAGES env.'
    );
  }
  const publishableSet = new Set(publishable);
  const unknown = selected.filter((name) => !publishableSet.has(name));
  if (unknown.length > 0) {
    throw new Error(
      `Selected package(s) are not publishable workspace packages: ${unknown.join(', ')}\n` +
        `Known publishable packages:\n  ${publishable.join('\n  ')}`
    );
  }
  const selectedSet = new Set(selected);
  return publishable.filter((name) => !selectedSet.has(name)).sort();
}

async function main(): Promise<void> {
  const dryRun = process.argv.includes('--dry-run');
  const cwd = process.cwd();

  console.log('📦 Set limited-release ignore list: start...');

  const selected = getSelectedPackages();

  const { packages } = await getPackages(cwd);
  const publishable = packages
    .filter((pkg) => !pkg.packageJson.private)
    .map((pkg) => pkg.packageJson.name);

  const ignore = resolveIgnoreList(publishable, selected);

  console.log('\n✅ Releasing:');
  selected.forEach((name) => console.log(`  + ${name}`));
  console.log('\n🚫 Ignoring:');
  if (ignore.length === 0) {
    console.log('  (none — all publishable packages selected)');
  } else {
    ignore.forEach((name) => console.log(`  - ${name}`));
  }

  const configPath = path.join(cwd, CONFIG_RELATIVE_PATH);
  const config = JSON.parse(readFileSync(configPath, 'utf8')) as Record<string, unknown>;
  config.ignore = ignore;

  if (dryRun) {
    console.log('\n🔍 DRY RUN MODE - config not written. Resulting "ignore":');
    console.log(JSON.stringify(ignore, null, 2));
    return;
  }

  writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`, 'utf8');
  console.log(`\n✅ Updated ${CONFIG_RELATIVE_PATH} with ${ignore.length} ignored package(s).`);
}

function isMainModule(): boolean {
  try {
    return !!process.argv[1] && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url));
  } catch {
    return false;
  }
}

if (isMainModule()) {
  main().catch((error: unknown) => {
    const err = error as Error;
    console.error('❌ Error:', err.message);
    console.error(err.stack);
    process.exit(1);
  });
}

