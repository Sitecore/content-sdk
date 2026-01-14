// resolve package name based on GH action input value and put value for further processing into GH output
const fs = require('fs');
const path = require('path');

const input = process.argv[2];
if (!input) process.exit(1);

const packagesDir = path.join(__dirname, '..', 'packages');
const dirs = fs.readdirSync(packagesDir, { withFileTypes: true }).filter((d) => d.isDirectory());

for (const dir of dirs) {
  try {
    const pkg = JSON.parse(
      fs.readFileSync(path.join(packagesDir, dir.name, 'package.json'), 'utf8')
    );
    if (pkg.name === input || pkg.name === `@sitecore-content-sdk/${input}` || dir.name === input) {
      console.log(`full_name=${pkg.name}`);
      process.exit(0);
    }
  } catch {}
}

console.error(`Package '${input}' not found`);
process.exit(1);
