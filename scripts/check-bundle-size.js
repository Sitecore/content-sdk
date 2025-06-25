const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packages = ['nextjs', 'cli', 'core']; // List all workspace packages
const baseBranch = process.env.BASE_BRANCH || 'origin/dev';
const tempDir = path.resolve(__dirname, '../.tmp-bundle-sizes');

// Recursively calculate total folder size in KB
/**
 *
 * @param folderPath
 */
function getFolderSizeInKB(folderPath) {
  if (!fs.existsSync(folderPath)) return null;

  let totalSize = 0;
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    if (entry.isDirectory()) {
      totalSize += getFolderSizeInKB(fullPath) || 0;
    } else if (entry.isFile()) {
      totalSize += fs.statSync(fullPath).size;
    }
  }

  return +(totalSize / 1024).toFixed(2);
}

// Build all packages at once
/**
 *
 */
function buildAll() {
  execSync('yarn build', { stdio: 'ignore' });
}

// Save all package folder sizes to JSON
/**
 *
 * @param outputFile
 */
function recordSizes(outputFile) {
  const sizes = {};
  for (const pkg of packages) {
    const distPath = path.resolve(__dirname, `../packages/${pkg}/dist`);
    sizes[pkg] = getFolderSizeInKB(distPath);
  }
  fs.writeFileSync(outputFile, JSON.stringify(sizes, null, 2));
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

// Main script
/**
 *
 */
function run() {
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  // Checkout base and build
  execSync(`git checkout ${baseBranch}`, { stdio: 'ignore' });
  buildAll();
  const baseFile = path.join(tempDir, 'base-sizes.json');
  recordSizes(baseFile);

  // Checkout back and build PR branch
  execSync('git checkout -', { stdio: 'ignore' });
  buildAll();
  const prFile = path.join(tempDir, 'pr-sizes.json');
  recordSizes(prFile);

  const baseSizes = JSON.parse(fs.readFileSync(baseFile));
  const prSizes = JSON.parse(fs.readFileSync(prFile));

  // Generate markdown report
  let markdown =
    '### 📦 Bundle Size Report (Folder: `dist/`)\n\n| Package | Base Size | PR Size | Δ Change |\n|--------|-----------|---------|----------|\n';
  let totalDelta = 0;

  for (const pkg of packages) {
    const base = baseSizes[pkg];
    const pr = prSizes[pkg];
    const delta = base !== null && pr !== null ? pr - base : null;
    if (delta !== null) totalDelta += delta;
    markdown += `| ${pkg} | ${base ?? 'N/A'} KB | ${pr ?? 'N/A'} KB | ${formatDelta(delta)} |\n`;
  }

  markdown += `| **Total** | — | — | ${formatDelta(totalDelta)} |\n`;
  fs.writeFileSync('bundle-size-report.md', markdown, 'utf8');
}

run();
