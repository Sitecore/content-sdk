#!/usr/bin/env node
/**
 * Cleanup script for CHANGELOG.md files
 * Removes HTML comments, empty sections, and "Updated dependencies" blocks
 *
 * Run after beachball bump: node .beachball/cleanup-changelogs.js
 */

const fs = require('fs');
const path = require('path');

const packagesDir = path.join(__dirname, '..', 'packages');
const packages = [
  'core',
  'react',
  'nextjs',
  'cli',
  'search',
  'create-content-sdk-app',
];

function cleanupChangelog(changelogPath) {
  if (!fs.existsSync(changelogPath)) {
    return false;
  }

  let content = fs.readFileSync(changelogPath, 'utf-8');
  const originalContent = content;

  // Normalize line endings to LF
  content = content.replace(/\r\n/g, '\n');

  // Remove HTML comments
  content = content.replace(/<!--[\s\S]*?-->\n?/g, '');

  // Remove "Updated dependencies" sections (multiline with indented items)
  content = content.replace(/- Updated dependencies\n(  - [^\n]+\n)+/g, '');

  // Remove lines that contain "Bump X to vY" pattern
  content = content.replace(/^- Bump @?[\w\/-]+ to v[\d.]+[^\n]*\n/gm, '');

  // Replace "Patch Changes" with emoji header
  content = content.replace(/### Patch Changes/g, '### 🐛 Bug Fixes');

  // Replace "Minor Changes" with emoji header
  content = content.replace(/### Minor Changes/g, '### ✨ Features');

  // Replace "Major Changes" with emoji header
  content = content.replace(/### Major Changes/g, '### 💥 Breaking Changes');

  // Remove empty change type sections (### Header followed by only whitespace until next ## or ### or EOF)
  // Run this multiple times to catch nested empty sections
  for (let i = 0; i < 3; i++) {
    content = content.replace(/### [^\n]+\n\n(?=###|##|$)/g, '');
    content = content.replace(/### [^\n]+\n(?=###|##|$)/g, '');
  }

  // Remove multiple consecutive blank lines
  content = content.replace(/\n{3,}/g, '\n\n');

  // Trim trailing whitespace on each line
  content = content
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n');

  // Trim trailing whitespace at end of file
  content = content.trim() + '\n';

  if (content !== originalContent) {
    fs.writeFileSync(changelogPath, content);
    return true;
  }
  return false;
}

console.log('Cleaning up CHANGELOG.md files...');

let cleanedCount = 0;
packages.forEach((pkg) => {
  const changelogPath = path.join(packagesDir, pkg, 'CHANGELOG.md');
  if (cleanupChangelog(changelogPath)) {
    console.log(`  ✓ Cleaned: packages/${pkg}/CHANGELOG.md`);
    cleanedCount++;
  }
});

if (cleanedCount === 0) {
  console.log('  No changes needed.');
} else {
  console.log(`\nCleaned ${cleanedCount} changelog(s).`);
}
