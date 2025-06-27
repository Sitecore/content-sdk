const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// CONFIG
const packages = ['cli', 'core', 'create-content-sdk-app', 'nextjs', 'react'];
const baseBranch = process.env.BASE_BRANCH || 'origin/dev';
const tempDir = path.resolve(__dirname, '../.tmp-bundle-sizes');

// SAMPLES
const sampleManifest = require('./samples.json');
const { getAppFolder } = require('./utils');
const scaffoldedSamples = sampleManifest.map((sample) =>
  getAppFolder({ ...sample.args, template: sample.template })
);

// UTILS
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

// COVERAGE
const coverageRegex = /All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/;

/**
 *
 * @param packageName
 */
function runCoverage(packageName) {
  const pkgPath = path.resolve(__dirname, `../packages/${packageName}`);
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
    }
  } catch (err) {
    console.warn(`⚠️ Coverage failed for ${packageName}: ${err.message}`);
  }
  return { avg: 0, display: '⚠️ N/A' };
}

// BUILD
/**
 *
 */
function buildAll() {
  execSync('yarn build', { stdio: 'ignore' });
}

// MAIN
/**
 *
 */
function generateBundleSizeReport() {
  const baseSizes = {};
  const prSizes = {};

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  // === Base Branch ===
  execSync(`git checkout ${baseBranch}`, { stdio: 'ignore' });
  console.log(`📦 Building base branch (${baseBranch})...`);
  buildAll();

  console.log('📁 Measuring base dist sizes...');
  for (const pkg of packages) {
    const distPath = path.resolve(__dirname, `../packages/${pkg}/dist`);
    baseSizes[pkg] = getFolderSizeInKB(distPath);
  }

  console.log('📄 Scaffolding samples on base...');
  execSync('yarn scaffold-samples', { stdio: 'ignore' });
  for (const app of scaffoldedSamples) {
    const distPath = path.resolve(__dirname, `../samples/${app}/dist`);
    baseSizes[`sample-${app}`] = getFolderSizeInKB(distPath);
  }

  // === PR Branch ===
  execSync('git checkout -', { stdio: 'ignore' });
  console.log('📦 Building PR branch...');
  buildAll();

  console.log('📁 Measuring PR dist sizes...');
  for (const pkg of packages) {
    const distPath = path.resolve(__dirname, `../packages/${pkg}/dist`);
    prSizes[pkg] = getFolderSizeInKB(distPath);
  }

  console.log('📄 Scaffolding samples on PR...');
  execSync('yarn scaffold-samples', { stdio: 'ignore' });
  for (const app of scaffoldedSamples) {
    const distPath = path.resolve(__dirname, `../samples/${app}/dist`);
    prSizes[`sample-${app}`] = getFolderSizeInKB(distPath);
  }

  // === Report ===
  const allKeys = [...packages, ...scaffoldedSamples.map((name) => `sample-${name}`)];
  let markdown = '### 📦 Bundle Size Report (Folder: `dist/`, in KB, with Test Coverage)\n\n';
  markdown += '| Package | Base Size | PR Size | Δ Change | Test Coverage |\n';
  markdown += '|---------|-----------|---------|----------|----------------|\n';

  let totalDelta = 0;

  for (const key of allKeys) {
    const label = key.startsWith('sample-') ? key.replace('sample-', '') : key;
    const base = baseSizes[key];
    const pr = prSizes[key];
    const delta = base !== null && pr !== null ? pr - base : null;
    if (delta !== null) totalDelta += delta;

    const coverage = key.startsWith('sample-') ? '—' : runCoverage(label).display;

    markdown += `| ${label} | ${base?.toFixed(2) ?? 'N/A'} KB | ${pr?.toFixed(2) ??
      'N/A'} KB | ${formatDelta(delta)} | ${coverage} |\n`;
  }

  markdown += `| **Total** | — | — | ${formatDelta(totalDelta)} | — |\n`;

  fs.writeFileSync('bundle-size-report.md', markdown, 'utf8');
  console.log('✅ Report written to bundle-size-report.md');
}

// RUN
generateBundleSizeReport();
