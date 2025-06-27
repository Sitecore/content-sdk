const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// === CONFIG ===
const packages = ['cli', 'core', 'create-content-sdk-app', 'nextjs', 'react'];
const baseBranch = process.env.BASE_BRANCH || 'origin/dev';
const tempDir = path.resolve(__dirname, '../.tmp-bundle-sizes');

// === SAMPLE SETUP (single app) ===
const sampleManifest = require('./samples.json');
const { getAppFolder } = require('./utils');
const sampleConfig = sampleManifest[0]; // only one app
const scaffoldedApp = getAppFolder({ ...sampleConfig.args, template: sampleConfig.template });

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
 * @param appName
 */
function getNextJsBundleSize(appName) {
  const mainJsPath = path.resolve(__dirname, `../samples/${appName}/.next/static/chunks/main.js`);
  try {
    const result = execSync(`npx source-map-explorer "${mainJsPath}" --json`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const parsed = JSON.parse(result);
    const bundle = Object.values(parsed)[0];
    const totalBytes = bundle?.bundles?.[0]?.totalBytes;
    return totalBytes ? +(totalBytes / 1024).toFixed(2) : null;
  } catch (err) {
    console.warn(`⚠️ Failed to analyze bundle size for ${appName}: ${err.message}`);
    return null;
  }
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

// === COVERAGE ===
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

// === BUILD ===
/**
 *
 */
function buildAll() {
  execSync('yarn build', { stdio: 'ignore' });
}

// === MAIN ===
/**
 *
 */
function generateBundleSizeReport() {
  const baseSizes = {};
  const prSizes = {};

  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  // === BASE BRANCH ===
  execSync(`git checkout ${baseBranch}`, { stdio: 'ignore' });
  console.log(`📦 Building base branch (${baseBranch})...`);
  buildAll();

  console.log('📁 Measuring base package sizes...');
  for (const pkg of packages) {
    const distPath = path.resolve(__dirname, `../packages/${pkg}/dist`);
    baseSizes[pkg] = getFolderSizeInKB(distPath);
  }

  try {
    console.log('📄 Scaffolding samples on base...');
    execSync('yarn scaffold-samples', { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Failed to scaffold samples on base branch');
    throw err;
  }
  baseSizes[`sample-${scaffoldedApp}`] = getNextJsBundleSize(scaffoldedApp);

  // === PR BRANCH ===
  execSync('git checkout -', { stdio: 'ignore' });
  console.log('📦 Building PR branch...');
  buildAll();

  console.log('📁 Measuring PR package sizes...');
  for (const pkg of packages) {
    const distPath = path.resolve(__dirname, `../packages/${pkg}/dist`);
    prSizes[pkg] = getFolderSizeInKB(distPath);
  }

  try {
    console.log('📄 Scaffolding samples on PR...');
    execSync('yarn scaffold-samples', { stdio: 'inherit' });
  } catch (err) {
    console.error('❌ Failed to scaffold samples on base branch');
    throw err;
  }
  prSizes[`sample-${scaffoldedApp}`] = getNextJsBundleSize(scaffoldedApp);

  // === REPORT ===
  const allKeys = [...packages, `sample-${scaffoldedApp}`];
  let markdown = '### 📦 Bundle Size Report (with Test Coverage)\n\n';
  markdown += '| Package | Base Size | PR Size | Δ Change | Test Coverage |\n';
  markdown += '|---------|-----------|---------|----------|----------------|\n';

  let totalDelta = 0;

  for (const key of allKeys) {
    const label = key.startsWith('sample-') ? key.replace('sample-', '') : key;
    const base = baseSizes[key];
    const pr = prSizes[key];
    const delta = base !== null && pr !== null ? pr - base : null;
    if (delta !== null) totalDelta += delta;

    const coverage = key.startsWith('sample-') ? '🚫 Not applicable' : runCoverage(label).display;

    markdown += `| ${label} | ${base?.toFixed(2) ?? 'N/A'} KB | ${pr?.toFixed(2) ??
      'N/A'} KB | ${formatDelta(delta)} | ${coverage} |\n`;
  }

  markdown += `| **Total** | — | — | ${formatDelta(totalDelta)} | — |\n`;

  fs.writeFileSync('bundle-size-report.md', markdown, 'utf8');
  console.log('✅ Report written to bundle-size-report.md');
}

// === RUN ===
generateBundleSizeReport();
