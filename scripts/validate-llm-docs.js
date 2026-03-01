const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const ROOT = path.resolve(__dirname, '..');
const PACKAGES_DIR = path.join(ROOT, 'packages');
const TEMPLATES_DIR = path.join(ROOT, 'packages', 'create-content-sdk-app', 'src', 'templates');
const SAMPLES_JSON = path.join(ROOT, 'scripts', 'samples.json');

const DOC_FILES = {
  'AGENTS.md': path.join(ROOT, 'AGENTS.md'),
  'LLMs.txt': path.join(ROOT, 'LLMs.txt'),
  '.cursor/rules/repo-structure.mdc': path.join(ROOT, '.cursor', 'rules', 'repo-structure.mdc'),
};

/**
 * Returns directories under packages/ that contain a package.json (real packages).
 * @returns {{ dir: string, name: string }[]}
 */
function getActualPackages() {
  return fs
    .readdirSync(PACKAGES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => fs.existsSync(path.join(PACKAGES_DIR, entry.name, 'package.json')))
    .map((entry) => {
      const pkg = JSON.parse(
        fs.readFileSync(path.join(PACKAGES_DIR, entry.name, 'package.json'), 'utf-8')
      );
      return { dir: entry.name, name: pkg.name || entry.name };
    });
}

/**
 * Returns directory names under templates/ that contain a package.json.
 * @returns {string[]}
 */
function getActualTemplates() {
  if (!fs.existsSync(TEMPLATES_DIR)) return [];
  return fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) =>
      fs.existsSync(path.join(TEMPLATES_DIR, entry.name, 'package.json'))
    )
    .map((entry) => entry.name);
}

/**
 * Returns template names referenced in scripts/samples.json.
 * @returns {string[]}
 */
function getSamplesJsonTemplates() {
  if (!fs.existsSync(SAMPLES_JSON)) return [];
  const raw = fs.readFileSync(SAMPLES_JSON, 'utf-8').replace(/^\uFEFF/, '');
  const samples = JSON.parse(raw);
  return samples.map((s) => s.template);
}

/**
 * Checks whether a doc file mentions a package (by directory name or npm name).
 * @param {string} content - file content
 * @param {{ dir: string, name: string }} pkg - package info
 * @returns {boolean}
 */
function docMentionsPackage(content, pkg) {
  return content.includes(pkg.dir) || content.includes(pkg.name);
}

/**
 * Checks whether a doc file mentions a template name.
 * @param {string} content - file content
 * @param {string} template - template directory name
 * @returns {boolean}
 */
function docMentionsTemplate(content, template) {
  return content.includes(template);
}

function validate() {
  const errors = [];
  const warnings = [];

  const actualPackages = getActualPackages();
  const actualTemplates = getActualTemplates();
  const samplesTemplates = getSamplesJsonTemplates();

  // --- Validate packages in doc files ---
  for (const [docName, docPath] of Object.entries(DOC_FILES)) {
    if (!fs.existsSync(docPath)) {
      errors.push(`${docName} does not exist at ${docPath}`);
      continue;
    }
    const content = fs.readFileSync(docPath, 'utf-8');

    for (const pkg of actualPackages) {
      if (!docMentionsPackage(content, pkg)) {
        errors.push(
          `${docName}: package "${pkg.dir}" (${pkg.name}) exists on disk but is not documented`
        );
      }
    }
  }

  // --- Validate templates in AGENTS.md ---
  const agentsPath = DOC_FILES['AGENTS.md'];
  if (fs.existsSync(agentsPath)) {
    const agentsContent = fs.readFileSync(agentsPath, 'utf-8');
    for (const template of actualTemplates) {
      if (!docMentionsTemplate(agentsContent, template)) {
        errors.push(
          `AGENTS.md: template "${template}" exists on disk but is not mentioned`
        );
      }
    }
  }

  // --- Validate samples.json references ---
  for (const template of samplesTemplates) {
    if (!actualTemplates.includes(template)) {
      errors.push(
        `scripts/samples.json: references template "${template}" but it does not exist in ${TEMPLATES_DIR}`
      );
    }
  }

  // --- Check for stale package references in doc files ---
  const actualPackageIdentifiers = new Set();
  for (const pkg of actualPackages) {
    actualPackageIdentifiers.add(pkg.dir);
    actualPackageIdentifiers.add(pkg.name);
  }

  for (const [docName, docPath] of Object.entries(DOC_FILES)) {
    if (!fs.existsSync(docPath)) continue;
    const content = fs.readFileSync(docPath, 'utf-8');

    const pkgPattern = /@sitecore-content-sdk\/[\w-]+/g;
    const matches = content.match(pkgPattern) || [];
    const uniqueRefs = [...new Set(matches)];

    for (const ref of uniqueRefs) {
      if (!actualPackageIdentifiers.has(ref)) {
        warnings.push(
          `${docName}: references "${ref}" but no matching package exists on disk`
        );
      }
    }
  }

  // --- Check for stale template references in samples.json ---
  for (const template of actualTemplates) {
    if (!samplesTemplates.includes(template)) {
      warnings.push(
        `scripts/samples.json: template "${template}" exists on disk but is not configured for scaffolding`
      );
    }
  }

  // --- Report ---
  if (errors.length === 0 && warnings.length === 0) {
    console.log(chalk.green('✓ All LLM doc files are in sync with the repo structure.'));
    return 0;
  }

  if (errors.length > 0) {
    console.log(chalk.red.bold(`\n✗ ${errors.length} error(s) found:\n`));
    for (const err of errors) {
      console.log(chalk.red(`  • ${err}`));
    }
  }

  if (warnings.length > 0) {
    console.log(chalk.yellow.bold(`\n⚠ ${warnings.length} warning(s):\n`));
    for (const warn of warnings) {
      console.log(chalk.yellow(`  • ${warn}`));
    }
  }

  console.log(
    chalk.dim(
      '\nUpdate the listed files to match the current repo structure. See AGENTS.md for the expected format.'
    )
  );

  return errors.length > 0 ? 1 : 0;
}

process.exit(validate());
