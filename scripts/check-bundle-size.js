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
function getFolderSizeInMB(folderPath) {
  if (!fs.existsSync(folderPath)) return null;

  let totalBytes = 0;

  /**
   *
   * @param dir
   */
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isSymbolicLink()) {
        continue; // skip symlinks
      } else if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        if (!fullPath.endsWith('.map')) {
          totalBytes += fs.statSync(fullPath).size;
        }
      }
    }
  }

  walk(folderPath);

  return +(totalBytes / (1024 * 1024)).toFixed(2); // return in MB
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
    sizes[pkg] = getFolderSizeInMB(distPath);
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
