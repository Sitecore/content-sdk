const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packages = ['cli', 'core', 'create-content-sdk-app', 'nextjs', 'react'];
const baseBranch = process.env.BASE_BRANCH || 'origin/dev';
const tempDir = path.resolve(__dirname, '../.tmp-bundle-sizes');
const coverageRegex = /All files\s+\|\s+([\d.]+)\s+\|/;

// Recursively calculate total folder size in KB
/**
 *
 * @param folderPath
 */
function getFolderSizeInKB(folderPath) {
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
        continue; // Skip symlinks
      } else if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        // Skip source maps if needed
        if (!fullPath.endsWith('.map')) {
          totalBytes += fs.statSync(fullPath).size;
        }
      }
    }
  }

  walk(folderPath);
  return +(totalBytes / 1024).toFixed(2); // Convert to KB
}

// Run full build
/**
 *
 */
function buildAll() {
  execSync('yarn build', { stdio: 'ignore' });
}

// Save dist sizes for all packages
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

// Format delta string
/**
 *
 * @param delta
 */
function formatDelta(delta) {
  if (delta === null) return '⚠️';
  if (delta === 0) return '✅ 0.00 KB';
  const emoji = delta > 0 ? '🔺' : '🔻';
  const sign = delta > 0 ? '+' : '';
  return `${emoji} ${sign}${delta.toFixed(2)} KB`;
}

// Main script logic
/**
 *
 */
function run() {
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  // Build and record sizes from base branch
  execSync(`git checkout ${baseBranch}`, { stdio: 'ignore' });
  buildAll();
  const baseFile = path.join(tempDir, 'base-sizes.json');
  recordSizes(baseFile);

  // Build and record sizes from current PR branch
  execSync('git checkout -', { stdio: 'ignore' });
  buildAll();
  const prFile = path.join(tempDir, 'pr-sizes.json');
  recordSizes(prFile);

  const baseSizes = JSON.parse(fs.readFileSync(baseFile));
  const prSizes = JSON.parse(fs.readFileSync(prFile));

  // Generate markdown report
  let markdown = '### 📦 Bundle Size Report (Folder: `dist/`, in KB)\n\n';
  markdown += '| Package | Base Size | PR Size | Δ Change |\n';
  markdown += '|---------|-----------|---------|----------|\n';

  let totalDelta = 0;

  for (const pkg of packages) {
    const base = baseSizes[pkg];
    const pr = prSizes[pkg];
    const delta = base !== null && pr !== null ? pr - base : null;

    if (delta !== null) totalDelta += delta;

    markdown += `| ${pkg} | ${base?.toFixed(2) ?? 'N/A'} KB | ${pr?.toFixed(2) ??
      'N/A'} KB | ${formatDelta(delta)} |\n`;
  }

  markdown += `| **Total** | — | — | ${formatDelta(totalDelta)} |\n`;

  fs.writeFileSync('bundle-size-report.md', markdown, 'utf8');
}

run();
