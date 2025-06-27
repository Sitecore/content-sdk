const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packages = ['cli', 'core', 'create-content-sdk-app', 'nextjs', 'react'];
const baseBranch = process.env.BASE_BRANCH || 'origin/dev';
const tempDir = path.resolve(__dirname, '../.tmp-bundle-sizes');

// === UTILS ===

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
      if (entry.isSymbolicLink()) continue;
      if (entry.isDirectory()) walk(fullPath);
      else if (entry.isFile() && !fullPath.endsWith('.map')) {
        totalBytes += fs.statSync(fullPath).size;
      }
    }
  }
  walk(folderPath);
  return +(totalBytes / 1024).toFixed(2);
}

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

/**
 *
 * @param avg
 */
function colorizeCoverage(avg) {
  return avg >= 80 ? `🟢 **${avg.toFixed(2)}%**` : `🔴 **${avg.toFixed(2)}%**`;
}

// === BUNDLE SIZE ===

/**
 *
 */
function buildAll() {
  execSync('yarn build', { stdio: 'ignore' });
}

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

const coverageRegex = /All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/;

/**
 *
 * @param packageName
 */
function runCoverage(packageName) {
  const pkgPath = path.resolve(__dirname, `../packages/${packageName}`);
  console.log(`→ Running coverage in ${packageName}...`);

  try {
    const result = execSync('yarn run coverage', {
      cwd: pkgPath,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const match = result.match(coverageRegex);
    if (match) {
      const [stmts, branch, funcs, lines] = match.slice(1).map(parseFloat);
      const avg = (stmts + branch + funcs + lines) / 4;
      return { avg, display: colorizeCoverage(avg) };
    } else {
      return { avg: 0, display: '⚠️ N/A' };
    }
  } catch (err) {
    console.warn(`⚠️ Failed in ${packageName}: ${err.message}`);
    return { avg: 0, display: '⚠️ N/A' };
  }
}

/**
 *
 */
function generateBundleSizeReport() {
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  // Build and measure base branch
  execSync(`git checkout ${baseBranch}`, { stdio: 'ignore' });
  buildAll();
  const baseFile = path.join(tempDir, 'base-sizes.json');
  recordSizes(baseFile);

  // Build and measure current branch
  execSync('git checkout -', { stdio: 'ignore' });
  buildAll();
  const prFile = path.join(tempDir, 'pr-sizes.json');
  recordSizes(prFile);

  const baseSizes = JSON.parse(fs.readFileSync(baseFile));
  const prSizes = JSON.parse(fs.readFileSync(prFile));

  let markdown = '### 📦 Bundle Size Report (Folder: `dist/`, in KB, with Test Coverage)\n\n';
  markdown += '| Package | Base Size | PR Size | Δ Change | Test Coverage |\n';
  markdown += '|---------|-----------|---------|----------|----------------|\n';

  let totalDelta = 0;

  for (const pkg of packages) {
    const base = baseSizes[pkg];
    const pr = prSizes[pkg];
    const delta = base !== null && pr !== null ? pr - base : null;
    if (delta !== null) totalDelta += delta;

    // Run coverage inline
    const { display: coverageDisplay } = runCoverage(pkg);

    markdown += `| ${pkg} | ${base?.toFixed(2) ?? 'N/A'} KB | ${pr?.toFixed(2) ??
      'N/A'} KB | ${formatDelta(delta)} | ${coverageDisplay} |\n`;
  }

  markdown += `| **Total** | — | — | ${formatDelta(totalDelta)} | — |\n`;

  fs.writeFileSync('bundle-size-report.md', markdown, 'utf8');
  console.log('✅ Combined bundle size & coverage report written to bundle-size-report.md');
}

generateBundleSizeReport();
