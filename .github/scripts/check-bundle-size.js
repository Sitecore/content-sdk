const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packages = ['nextjs', 'cli', 'core', 'react', 'create-content-sdk-app'];
const baseBranch = process.env.BASE_BRANCH || 'origin/dev';

function getFileSizeKB(file) {
  return +(fs.statSync(file).size / 1024).toFixed(2);
}

function build(pkg) {
  execSync(`yarn workspace ${pkg} build`, { stdio: 'ignore' });
}

function getDistFile(pkg) {
  return path.join(__dirname, `../packages/${pkg}/dist/index.js`);
}

function formatDelta(delta) {
  const emoji = delta > 0 ? '🔺' : delta < 0 ? '🔻' : '✅';
  const sign = delta > 0 ? '+' : '';
  return `${emoji} ${sign}${delta.toFixed(2)} KB`;
}

function run() {
  const tempDir = '.bundle-size-temp';
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  let table = `### 📦 Bundle Size Report\n\n| Package | Base Size | PR Size | Δ Change |\n|--------|-----------|---------|----------|\n`;
  let totalDelta = 0;

  for (const pkg of packages) {
    // Checkout base and build
    execSync(`git checkout ${baseBranch}`, { stdio: 'ignore' });
    build(pkg);
    const baseSize = getFileSizeKB(getDistFile(pkg));

    // Checkout PR and build
    execSync(`git checkout -`, { stdio: 'ignore' });
    build(pkg);
    const prSize = getFileSizeKB(getDistFile(pkg));

    const delta = prSize - baseSize;
    totalDelta += delta;
    table += `| ${pkg} | ${baseSize} KB | ${prSize} KB | ${formatDelta(delta)} |\n`;
  }

  table += `| **Total Change** |  |  | ${formatDelta(totalDelta)} |\n`;
  fs.writeFileSync('bundle-size-report.md', table);
}

run();
