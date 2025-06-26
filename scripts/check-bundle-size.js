const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packages = ['nextjs', 'cli', 'core']; // Update this list as needed
const baseBranch = process.env.BASE_BRANCH || 'origin/dev';
const tempDir = path.resolve(__dirname, '../.tmp-bundle-sizes');

// Recursively calculate total folder size in MB
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
        continue; // Skip symlinks (e.g., node_modules)
      } else if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        // Skip source maps
        if (!fullPath.endsWith('.map')) {
          totalBytes += fs.statSync(fullPath).size;
        }
      }
    }
  }

  walk(folderPath);
  return +(totalBytes / (1024 * 1024)).toFixed(2); // Convert to MB
}

// Run top-level build
/**
 *
 */
function buildAll() {
  execSync('yarn build', { stdio: 'ignore' });
}

// Save dist folder sizes for all packages
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

// Format size change
/**
 *
 * @param delta
 */
function formatDelta(delta) {
  if (delta === null) return '⚠️';
  if (delta === 0) return '✅ 0.00 MB';
  const emoji = delta > 0 ? '🔺' : '🔻';
  const sign = delta > 0 ? '+' : '';
  return `${emoji} ${sign}${delta.toFixed(2)} MB`;
}

// Main script
/**
 *
 */
function run() {
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  // Checkout base branch, build, and record sizes
  execSync(`git checkout ${baseBranch}`, { stdio: 'ignore' });
  buildAll();
  const baseFile = path.join(tempDir, 'base-sizes.json');
  recordSizes(baseFile);

  // Checkout back to PR branch, build, and record sizes
  execSync('git checkout -', { stdio: 'ignore' });
  buildAll();
  const prFile = path.join(tempDir, 'pr-sizes.json');
  recordSizes(prFile);

  const baseSizes = JSON.parse(fs.readFileSync(baseFile));
  const prSizes = JSON.parse(fs.readFileSync(prFile));

  // Generate Markdown table
  let markdown = '### 📦 Bundle Size Report (Folder: `dist/`, in MB)\n\n';
  markdown += '| Package | Base Size | PR Size | Δ Change |\n';
  markdown += '|---------|-----------|---------|----------|\n';

  let totalDelta = 0;

  for (const pkg of packages) {
    const base = baseSizes[pkg];
    const pr = prSizes[pkg];
    const delta = base !== null && pr !== null ? pr - base : null;

    if (delta !== null) totalDelta += delta;

    markdown += `| ${pkg} | ${base?.toFixed(2) ?? 'N/A'} MB | ${pr?.toFixed(2) ??
      'N/A'} MB | ${formatDelta(delta)} |\n`;
  }

  markdown += `| **Total** | — | — | ${formatDelta(totalDelta)} |\n`;

  fs.writeFileSync('bundle-size-report.md', markdown, 'utf8');
}

run();
