const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const appName = 'sample-nextjs-SSG';
const appPath = path.resolve(__dirname, `../samples/${appName}`);
const reportPath = path.resolve(__dirname, '../sample-bundle-size.md');
const scaffoldScript = 'yarn scaffold-samples';

/**
 *
 */
function scaffoldSamples() {
  try {
    execSync(scaffoldScript, { stdio: 'inherit' });
  } catch (err) {
    throw new Error('❌ Failed to scaffold samples');
  }
}

/**
 *
 */
function buildAll() {
  execSync('yarn build', { stdio: 'ignore' });
}

/**
 *
 * @param appPath
 */
function getNextJsBundleSize(appPath) {
  // Run yarn install and build in the app folder
  try {
    console.log(`📦 Installing dependencies in ${appName}`);
    console.log(`Path: ${appPath}`);
    execSync('yarn install', {
      cwd: appPath,
      stdio: 'inherit',
    });

    console.log(`🏗️ Building ${appName}`);
    execSync('yarn build', {
      cwd: appPath,
      stdio: 'inherit',
    });

    const mainJsPath = path.resolve(appPath, '.next/static/chunks/main.js');

    console.log('📊 Analyzing bundle size...');
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
 * @param sizeInKB
 */
function generateReport(sizeInKB) {
  let markdown = '### 📦 Sample App Bundle Size Report\n\n';
  markdown += '| App | Bundle Size |\n';
  markdown += '|-----|--------------|\n';
  markdown += `| ${appName} | ${sizeInKB !== null ? sizeInKB + ' KB' : '⚠️ N/A'} |\n`;

  fs.writeFileSync(reportPath, markdown, 'utf8');
  console.log(`✅ Report written to ${reportPath}`);
}

buildAll();
scaffoldSamples();
const size = getNextJsBundleSize(appPath);
generateReport(size);
