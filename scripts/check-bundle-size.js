const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packages = ['nextjs', 'cli', 'core']; // Add more if needed
const baseBranch = process.env.BASE_BRANCH || 'origin/dev';
const distPath = (pkg) => path.resolve(__dirname, `../packages/${pkg}/dist/index.js`);
const tempDir = path.resolve(__dirname, '../.tmp-bundle-sizes');

// Run yarn build at root
/**
 *
 */
function buildAll() {
  execSync('yarn build', { stdio: 'ignore' });
}

// Get file size in KB
/**
 *
 * @param filePath
 */
function getSizeInKB(filePath) {
  return fs.existsSync(filePath) ? +(fs.statSync(filePath).size / 1024).toFixed(2) : null;
}

// Save sizes to file
/**
 *
 * @param file
 */
function recordSizes(file) {
  const result = {};
  for (const pkg of packages) {
    result[pkg] = getSizeInKB(distPath(pkg));
  }
  fs.writeFileSync(file, JSON.stringify(result, null, 2));
}

// Format delta
/**
 *
 * @param delta
 */
function formatDelta(delta) {
  if (delta === null) return '⚠️';
  if (delta === 0) return '✅ 0 KB';
  const emoji = delta > 0 ? '🔺' : '🔻';
  const sign = delta > 0 ? '+' : '';
  return `${emoji} ${sign}${delta.toFixed(2)} KB`;
}

// Main execution
/**
 *
 */
function run() {
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  // Checkout base and record sizes
  execSync(`git checkout ${baseBranch}`, { stdio: 'ignore' });
  buildAll();
  const baseFile = path.join(tempDir, 'base.json');
  recordSizes(baseFile);

  // Checkout back to PR branch and record sizes
  execSync('git checkout -', { stdio: 'ignore' });
  buildAll();
  const prFile = path.join(tempDir, 'pr.json');
  recordSizes(prFile);

  const baseSizes = JSON.parse(fs.readFileSync(baseFile));
  const prSizes = JSON.parse(fs.readFileSync(prFile));

  // Generate report
  let report =
    '### 📦 Bundle Size Report\n\n| Package | Base Size | PR Size | Δ Change |\n|--------|-----------|---------|----------|\n';
  let totalDelta = 0;

  for (const pkg of packages) {
    const base = baseSizes[pkg];
    const pr = prSizes[pkg];
    const delta = base !== null && pr !== null ? pr - base : null;

    if (delta !== null) totalDelta += delta;

    report += `| ${pkg} | ${base ?? 'N/A'} KB | ${pr ?? 'N/A'} KB | ${formatDelta(delta)} |\n`;
  }

  report += `| **Total** | — | — | ${formatDelta(totalDelta)} |\n`;

  fs.writeFileSync('bundle-size-report.md', report);
}

run();
