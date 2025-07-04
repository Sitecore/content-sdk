/* eslint-disable jsdoc/require-param */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packages = ['cli', 'core', 'create-content-sdk-app', 'nextjs', 'react'];
const tempDir = path.resolve(__dirname, '../.tmp-metric-report');
const baseBranch = process.env.BASE_BRANCH || 'origin/dev';

/**
 * Calculate the total size of a given folder in kilobytes,
 * excluding `.map` files and symlinks.
 */
function getPackageSize(folderPath) {
  if (!fs.existsSync(folderPath)) return null;
  let totalBytes = 0;

  // eslint-disable-next-line jsdoc/require-jsdoc
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
 * Run the build process across all packages.
 */
function buildAll() {
  console.log('📦 Running yarn build...');
  execSync('yarn build', { stdio: 'ignore' });
  console.log('✅ All packages built successfully.');
}

/**
 * Collect the size of each package's output directory.
 */
function recordPackageSizes() {
  console.log('📊 Measuring package sizes...');
  const sizes = {};
  for (const pkg of packages) {
    const distPath = path.resolve(__dirname, `../packages/${pkg}/dist`);
    sizes[pkg] = getPackageSize(distPath);
    console.log(`  • ${pkg}: ${sizes[pkg] !== null ? sizes[pkg] + ' KB' : 'N/A'}`);
  }
  return sizes;
}

/**
 * Run test coverage scripts for all packages and collect results.
 */
function recordCoverage() {
  console.log('🧪 Measuring test coverage...');
  const coverage = {};

  for (const pkg of packages) {
    try {
      const pkgPath = path.resolve(__dirname, `../packages/${pkg}`);
      const pkgJson = require(path.join(pkgPath, 'package.json'));
      if (!pkgJson.scripts?.coverage) throw new Error('No coverage script');

      console.log('Running test coverage...');
      const result = execSync('yarn run coverage', {
        cwd: pkgPath,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          testEnv: 'ci',
        },
      });

      const match = result.match(
        /All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/
      );
      if (match) {
        const values = match.slice(1, 5).map(Number);
        const avg = values.reduce((a, b) => a + b, 0) / values.length;
        coverage[pkg] = avg;
        console.log(`    → ${pkg}: ${avg.toFixed(2)}% avg coverage`);
      } else {
        throw new Error('Coverage metrics not found');
      }
    } catch (err) {
      console.warn(`⚠️ Coverage failed for ${pkg}: ${err.message}`);
      coverage[pkg] = null;
    }
  }

  return coverage;
}

/**
 * Format a delta in size (KB) with appropriate emoji.
 */
function formatPackageSizeDelta(delta) {
  if (delta === null) return '⚠️';
  if (delta === 0) return '✅ 0.00 KB';
  const emoji = delta > 0 ? '🔺' : '🔻';
  const sign = delta > 0 ? '+' : '';
  return `${emoji} ${sign}${delta.toFixed(2)} KB`;
}

/**
 * Format a delta in test coverage (%) with sign.
 */
function formatCoverageDelta(base, pr) {
  if (base === null || pr === null) return '⚠️ N/A';
  const delta = pr - base;
  const sign = delta > 0 ? '+' : '';
  return `${sign}${delta.toFixed(2)}%`;
}

/**
 * Generate and save the Markdown report for size and coverage deltas.
 */
function generateMetricReport(baseSizes, prSizes, baseCoverage, prCoverage) {
  console.log('📝 Generating Markdown report...');
  let markdown = '### 📦 Package Size and Test Coverage Report \n\n';
  markdown +=
    '| Package | Base Size | PR Size | Δ Change | Base Coverage | PR Coverage | Δ Change |\n';
  markdown +=
    '|---------|-----------|---------|----------|---------------|-------------|----------|\n';

  let totalDelta = 0;

  for (const pkg of packages) {
    const baseSize = baseSizes[pkg];
    const prSize = prSizes[pkg];
    const sizeDelta = baseSize !== null && prSize !== null ? prSize - baseSize : null;
    if (sizeDelta !== null) totalDelta += sizeDelta;

    const baseCov = baseCoverage[pkg];
    const prCov = prCoverage[pkg];
    const covDelta = formatCoverageDelta(baseCov, prCov);

    markdown += `| ${pkg} | ${baseSize?.toFixed(2) ?? 'N/A'} KB | ${prSize?.toFixed(2) ??
      'N/A'} KB | ${formatPackageSizeDelta(sizeDelta)} | ${
      baseCov !== null ? baseCov.toFixed(2) + '%' : '⚠️ N/A'
    } | ${prCov !== null ? prCov.toFixed(2) + '%' : '⚠️ N/A'} | ${covDelta} |\n`;
  }

  markdown += `| **Total** | — | — | ${formatPackageSizeDelta(totalDelta)} | — | — | — |\n`;
  fs.writeFileSync('metrics-report.md', markdown, 'utf8');
  console.log('✅ Report written to metrics-report.md');
}

/**
 * Main entry point:
 * - Checkout base branch
 * - Record size & coverage
 * - Checkout PR branch
 * - Record size & coverage
 * - Generate Markdown report
 */
function run() {
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  console.log(`🔀 Checking out base(dev) branch: ${baseBranch}`);
  execSync(`git checkout ${baseBranch}`, { stdio: 'ignore' });
  buildAll();
  const baseSizes = recordPackageSizes();
  const baseCoverage = recordCoverage();

  console.log('🔁 Checking out PR branch...');
  execSync('git checkout -', { stdio: 'ignore' });
  buildAll();
  const prSizes = recordPackageSizes();
  const prCoverage = recordCoverage();

  generateMetricReport(baseSizes, prSizes, baseCoverage, prCoverage);
}

run();
