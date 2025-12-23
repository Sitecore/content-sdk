#!/usr/bin/env node
/**
 * Fix internal dependency version ranges:
 * - Stable versions (e.g., 1.4.0) get caret (^1.4.0)
 * - Prerelease/canary versions (e.g., 1.4.0-canary.5) stay exact (1.4.0-canary.5)
 *
 * Run after: changeset version, lerna version, or any version bump
 */

const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '..', 'packages');

// Internal package prefixes to process
const internalPrefixes = ['@sitecore-content-sdk/', 'create-content-sdk-app'];

// Get all package directories
const packageDirs = fs.readdirSync(packagesDir).filter((dir) => {
  const pkgPath = path.join(packagesDir, dir, 'package.json');
  return fs.existsSync(pkgPath);
});

let updatedCount = 0;

packageDirs.forEach((dir) => {
  const pkgPath = path.join(packagesDir, dir, 'package.json');
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  let modified = false;

  // Process dependencies and devDependencies
  ['dependencies', 'devDependencies', 'peerDependencies'].forEach((depType) => {
    if (!pkg[depType]) return;

    Object.keys(pkg[depType]).forEach((depName) => {
      // Check if this is an internal dependency
      const isInternal = internalPrefixes.some(
        (prefix) => depName.startsWith(prefix) || depName === prefix
      );

      if (!isInternal) return;

      let version = pkg[depType][depName];

      // Skip workspace protocol
      if (version.startsWith('workspace:')) return;

      // Remove existing range modifiers to get the base version
      const baseVersion = version.replace(/^[\^~]/, '');

      // Check if it's a prerelease version (contains -)
      const isPrerelease = /-/.test(baseVersion);

      if (isPrerelease) {
        // Prerelease/canary: use exact version (no caret)
        if (version !== baseVersion) {
          pkg[depType][depName] = baseVersion;
          modified = true;
          console.log(`  ${dir}: ${depName} "${version}" -> "${baseVersion}" (exact for prerelease)`);
        }
      } else {
        // Stable: use caret version
        const caretVersion = `^${baseVersion}`;
        if (version !== caretVersion) {
          pkg[depType][depName] = caretVersion;
          modified = true;
          console.log(`  ${dir}: ${depName} "${version}" -> "${caretVersion}" (caret for stable)`);
        }
      }
    });
  });

  if (modified) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
    updatedCount++;
  }
});

if (updatedCount > 0) {
  console.log(`\n✅ Updated ${updatedCount} package(s) with correct dependency ranges.`);
} else {
  console.log('No dependency range updates needed.');
}
