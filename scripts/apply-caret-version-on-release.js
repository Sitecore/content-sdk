/**
 * Adds caret (^) to production version dependencies of internal monorepo packages as changesets cannot do that. Runs during production release.
 * Skips canary versions (.canary.xx).
 */

const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '..', 'packages');
const internalPrefixes = ['@sitecore-content-sdk/', 'create-content-sdk-app'];

fs.readdirSync(packagesDir).forEach((dir) => {
  const pkgPath = path.join(packagesDir, dir, 'package.json');
  if (!fs.existsSync(pkgPath)) return;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  if (!pkg.dependencies) return;

  let modified = false;

  Object.entries(pkg.dependencies).forEach(([name, version]) => {
    const isInternal = internalPrefixes.some((p) => name.startsWith(p) || name === p);
    if (!isInternal) return;

    // Skip canary versions
    if (version.includes('.canary.')) return;

    // Add caret if not already present
    if (!version.startsWith('^')) {
      const newVersion = `^${version.replace(/^~/, '')}`;
      pkg.dependencies[name] = newVersion;
      modified = true;
      console.log(`${dir}: ${name} "${version}" -> "${newVersion}"`);
    }
  });

  if (modified) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  }
});
