const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const packages = ['cli', 'core', 'create-content-sdk-app', 'nextjs', 'react'];
const outputFile = path.resolve(__dirname, '../coverage-report.md');

const ALL_FILES_REGEX = /All files\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)\s+\|\s+([\d.]+)/;

/**
 *
 * @param avg
 */
function colorizeCoverage(avg) {
  return avg >= 80 ? `🟢 **${avg.toFixed(2)}%**` : `🔴 **${avg.toFixed(2)}%**`;
}

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

    const match = result.match(ALL_FILES_REGEX);
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
function generateReport() {
  let markdown =
    '### ✅ Test Coverage Report (averaged across Statements, Branches, Functions, and Lines)\n\n';
  markdown += '| Package | Avg Coverage |\n';
  markdown += '|---------|--------------|\n';

  for (const pkg of packages) {
    const result = runCoverage(pkg);
    markdown += `| ${pkg} | ${result.display} |\n`;
  }

  fs.writeFileSync(outputFile, markdown, 'utf8');
  console.log(`✅ Test coverage report written to ${outputFile}`);
}

generateReport();
