const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packages = ['cli', 'core', 'create-content-sdk-app', 'nextjs', 'react'];
const tempDir = path.resolve(__dirname, '../.tmp-bundle-sizes');
const baseBranch = process.env.BASE_BRANCH || 'origin/dev';
// const scaffoldScript = 'yarn scaffold-samples';
const scaffoldedSampleApp = 'sample-nextjs-SSG';

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
 */
function buildAll() {
  execSync('yarn build', { stdio: 'ignore' });
}

/**
 *
 */
// function scaffoldSamples() {
//   try {
//     execSync(scaffoldScript, { stdio: 'inherit' });
//   } catch (err) {
//     throw new Error('❌ Failed to scaffold samples');
//   }
// }

/**
 *
 * @param appName
 */
// function getNextJsBundleSize(appName) {
//   const appPath = path.resolve(__dirname, `../samples/${appName}`);

//   try {
//     // Try installing dependencies
//     console.log(`📦 Installing dependencies in ${appName}`);
//     execSync('yarn install', {
//       cwd: appPath,
//       stdio: 'inherit',
//     });

//     // Build Next.js app
//     console.log(`🔧 Building ${appName}`);
//     execSync('yarn build', {
//       cwd: appPath,
//       stdio: 'inherit',
//     });

//     const mainJsPath = path.join(appPath, '.next/static/chunks/main.js');

//     // Analyze bundle
//     const result = execSync(`npx source-map-explorer "${mainJsPath}" --json`, {
//       encoding: 'utf-8',
//       stdio: ['pipe', 'pipe', 'pipe'],
//     });

//     const parsed = JSON.parse(result);
//     const bundle = Object.values(parsed)[0];
//     const totalBytes = bundle?.bundles?.[0]?.totalBytes;

//     return totalBytes ? +(totalBytes / 1024).toFixed(2) : null;
//   } catch (err) {
//     console.warn(`⚠️ Failed to analyze bundle size for ${appName}: ${err}`);
//     return null;
//   }
// }

/**
 *
 * @param packagesList
 * @param isSample
 */
function recordPackageSizes() {
  const sizes = {};
  for (const pkg of packages) {
    const distPath = path.resolve(__dirname, `../packages/${pkg}/dist`);
    sizes[pkg] = getFolderSizeInKB(distPath);
  }
  return sizes;
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
 * @param pkg
 */
function generateCoverage(pkg) {
  try {
    const pkgPath = path.resolve(__dirname, `../packages/${pkg}`);
    const pkgJson = require(path.join(pkgPath, 'package.json'));
    if (!pkgJson.scripts?.coverage) throw new Error('No coverage script');

    const result = execSync('yarn run coverage', {
      cwd: pkgPath,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        testEnv: 'ci',
      },
    });
    const match = result.match(/All files\s+\|\s+([\d.]+)/);
    const avg = match ? parseFloat(match[1]) : 0;
    return avg >= 80 ? `🟢 ${avg.toFixed(2)}%` : `🔴 ${avg.toFixed(2)}%`;
  } catch (err) {
    console.warn(`⚠️ Coverage failed for ${pkg}: ${err}`);
    return '⚠️ N/A';
  }
}

/**
 *
 * @param baseSizes
 * @param prSizes
 */
function generateBundleSizeReport(baseSizes, prSizes) {
  let markdown = '### 📦 Bundle Size Report (with Test Coverage)\n\n';
  markdown += '| Package | Base Size | PR Size | Δ Change | Test Coverage |\n';
  markdown += '|---------|-----------|---------|----------|----------------|\n';

  let totalDelta = 0;

  for (const pkg of [...packages, scaffoldedSampleApp]) {
    const base = baseSizes[pkg];
    const pr = prSizes[pkg];
    const delta = base !== null && pr !== null ? pr - base : null;
    const coverage = pkg === scaffoldedSampleApp ? '-' : generateCoverage(pkg);

    if (delta !== null) totalDelta += delta;

    markdown += `| ${pkg} | ${base?.toFixed(2) ?? 'N/A'} KB | ${pr?.toFixed(2) ??
      'N/A'} KB | ${formatDelta(delta)} | ${coverage} |\n`;
  }

  markdown += `| **Total** | — | — | ${formatDelta(totalDelta)} | — |\n`;
  fs.writeFileSync('bundle-size-report.md', markdown, 'utf8');
}

/**
 *
 */
function run() {
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  execSync(`git checkout ${baseBranch}`, { stdio: 'ignore' });
  buildAll();
  const baseSizes = recordPackageSizes();
  // scaffoldSamples();
  // baseSizes[scaffoldedSampleApp] = getNextJsBundleSize(scaffoldedSampleApp);

  execSync('git checkout -', { stdio: 'ignore' });
  buildAll();
  const prSizes = recordPackageSizes();
  // scaffoldSamples();
  // prSizes[scaffoldedSampleApp] = getNextJsBundleSize(scaffoldedSampleApp);

  generateBundleSizeReport(baseSizes, prSizes);
  console.log('✅ Report written to bundle-size-report.md');
}

run();
