/**
 * Measures the size of AI guidance ("LLM context") files that ship in each
 * Next.js template, and in the monorepo root, so we can track and cap the
 * amount of context an AI tool loads at session start.
 *
 * Motivation (JSS-9247): scaffolded starters were loading ~40k tokens of
 * guidance before any source code entered context. This script gives a
 * baseline, a per-tier breakdown, and a CI gate (--check) that fails when a
 * template's default ("always-on") stack or full corpus exceeds its budget.
 *
 * Tiers (see docs):
 * - S0 default: AGENTS.md + CLAUDE.md + always-apply Cursor rules. Loaded every session.
 * - S1 index:   Skills.md. Loaded to route a task to the right capability.
 * - S2 depth:   .agents/docs/ and glob-scoped .cursor/rules/. Loaded on demand.
 * - S3 tool:    .windsurfrules, copilot-instructions.md. Per-IDE only.
 * - skills:     .agents/skills/**\/SKILL.md. Ideally one per task.
 *
 * Usage:
 *   tsx ./scripts/llm-context/measure-llm-context.ts            # human-readable report
 *   tsx ./scripts/llm-context/measure-llm-context.ts --json     # machine-readable
 *   tsx ./scripts/llm-context/measure-llm-context.ts --check    # exit 1 if any budget exceeded
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable jsdoc/require-param */
/* eslint-disable no-console */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, resolve, sep } from 'path';

const REPO_ROOT = resolve(__dirname, '..', '..');
const TEMPLATES_DIR = join(REPO_ROOT, 'packages', 'create-content-sdk-app', 'src', 'templates');

/** Rough bytes-per-token heuristic for English prose + markdown. */
const BYTES_PER_TOKEN = 4;

type Tier = 'S0' | 'S1' | 'S2' | 'S3' | 'skills';

type FileEntry = {
  /** Path relative to the scan root. */
  path: string;
  bytes: number;
  tier: Tier;
};

type TargetReport = {
  name: string;
  root: string;
  files: FileEntry[];
  byTier: Record<Tier, number>;
  totalBytes: number;
  budget?: Budget;
  violations: string[];
};

type Budget = {
  /** Max bytes for the always-on S0 stack. */
  s0MaxBytes: number;
  /** Max bytes for the entire corpus. */
  totalMaxBytes: number;
  /** Max bytes for any single SKILL.md file. */
  skillMaxBytes: number;
};

/**
 * Budgets are intentionally generous relative to the target end-state so the
 * gate protects against regression/regrowth rather than blocking incremental
 * work. Tighten these as the slimming lands.
 */
const DEFAULT_BUDGET: Budget = {
  s0MaxBytes: 14 * 1024,
  totalMaxBytes: 80 * 1024,
  skillMaxBytes: 3.2 * 1024,
};

const CACHE_COMPONENTS_BUDGET: Budget = {
  s0MaxBytes: 16 * 1024,
  totalMaxBytes: 110 * 1024,
  skillMaxBytes: 3.2 * 1024,
};

const ROOT_BUDGET: Budget = {
  /** Session-start stack — primary gate for monorepo (was ~16.5 KB with 5 always-apply rules). */
  s0MaxBytes: 14 * 1024,
  /**
   * Full corpus including on-demand `.agents/docs/` (preserves rule depth without auto-loading).
   * S0 is the critical metric; total allows relocated guidance, not deletion.
   */
  totalMaxBytes: 42 * 1024,
  skillMaxBytes: 3.2 * 1024,
};

const AI_FILE_MATCHERS = ['.md', '.mdc'];
const AI_FILE_NAMES = ['.windsurfrules'];

/** Directories we never treat as AI-guidance corpus. */
const IGNORED_DIRS = new Set(['node_modules', 'dist', '.next', '.git', 'out', 'build']);

function isAiFile(fileName: string): boolean {
  if (AI_FILE_NAMES.includes(fileName)) return true;
  return AI_FILE_MATCHERS.some((ext) => fileName.endsWith(ext));
}

function hasAlwaysApply(filePath: string): boolean {
  // Cursor rules opt into always-loading via front-matter `alwaysApply: true`.
  const head = readFileSync(filePath, 'utf8').slice(0, 400);
  return /alwaysApply:\s*true/.test(head);
}

function classify(relPath: string, absPath: string): Tier {
  const parts = relPath.split(sep);
  const fileName = parts[parts.length - 1];

  if (relPath.includes(`.agents${sep}skills${sep}`) && fileName === 'SKILL.md') {
    return 'skills';
  }
  if (relPath.includes(`.agents${sep}docs${sep}`)) {
    return 'S2';
  }
  if (fileName === '.windsurfrules' || fileName === 'copilot-instructions.md') {
    return 'S3';
  }
  if (fileName === 'Skills.md') {
    return 'S1';
  }
  if (fileName === 'AGENTS.md' || fileName === 'CLAUDE.md') {
    return 'S0';
  }
  if (parts.includes('.cursor') && fileName.endsWith('.mdc')) {
    return hasAlwaysApply(absPath) ? 'S0' : 'S2';
  }
  // README and any other guidance markdown: on-demand.
  return 'S2';
}

function collectFiles(root: string): FileEntry[] {
  const entries: FileEntry[] = [];

  function walk(dir: string) {
    for (const dirent of readdirSync(dir, { withFileTypes: true })) {
      if (dirent.isSymbolicLink()) continue;
      if (dirent.isDirectory()) {
        if (IGNORED_DIRS.has(dirent.name)) continue;
        walk(join(dir, dirent.name));
        continue;
      }
      if (!dirent.isFile() || !isAiFile(dirent.name)) continue;

      const absPath = join(dir, dirent.name);
      const relPath = relative(root, absPath);
      entries.push({
        path: relPath,
        bytes: statSync(absPath).size,
        tier: classify(relPath, absPath),
      });
    }
  }

  walk(root);
  return entries.sort((a, b) => a.path.localeCompare(b.path));
}

function emptyTierTotals(): Record<Tier, number> {
  return { S0: 0, S1: 0, S2: 0, S3: 0, skills: 0 };
}

function buildReport(name: string, root: string, budget?: Budget): TargetReport {
  const files = collectFiles(root);
  const byTier = emptyTierTotals();
  let totalBytes = 0;
  for (const file of files) {
    byTier[file.tier] += file.bytes;
    totalBytes += file.bytes;
  }

  const violations: string[] = [];
  if (budget) {
    if (byTier.S0 > budget.s0MaxBytes) {
      violations.push(
        `S0 default stack ${fmt(byTier.S0)} exceeds budget ${fmt(budget.s0MaxBytes)}`
      );
    }
    if (totalBytes > budget.totalMaxBytes) {
      violations.push(`total corpus ${fmt(totalBytes)} exceeds budget ${fmt(budget.totalMaxBytes)}`);
    }
    for (const file of files) {
      if (file.tier === 'skills' && file.bytes > budget.skillMaxBytes) {
        violations.push(`${file.path} (${fmt(file.bytes)}) exceeds skill budget ${fmt(budget.skillMaxBytes)}`);
      }
    }
  }

  return { name, root, files, byTier, totalBytes, budget, violations };
}

function fmt(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

function tokens(bytes: number): string {
  return `~${Math.round(bytes / BYTES_PER_TOKEN).toLocaleString()} tok`;
}

/**
 * The monorepo root scan must not double-count template corpus, so we scan
 * only the top-level AI files plus root `.cursor/` and `.agents/` trees.
 */
function collectRootFiles(): FileEntry[] {
  const entries: FileEntry[] = [];
  const ROOT_ONLY_DIRS = new Set(['.cursor', '.agents']);
  const ROOT_ONLY_FILES = new Set(['AGENTS.md', 'CLAUDE.md', 'Skills.md', '.windsurfrules']);

  for (const fileName of ROOT_ONLY_FILES) {
    const abs = join(REPO_ROOT, fileName);
    if (existsSync(abs)) {
      entries.push({ path: fileName, bytes: statSync(abs).size, tier: classify(fileName, abs) });
    }
  }

  for (const dirName of ROOT_ONLY_DIRS) {
    const abs = join(REPO_ROOT, dirName);
    if (!existsSync(abs)) continue;
    for (const file of collectFiles(REPO_ROOT).filter((f) => f.path.startsWith(dirName + sep))) {
      entries.push(file);
    }
  }

  return entries.sort((a, b) => a.path.localeCompare(b.path));
}

function buildRootReport(): TargetReport {
  const files = collectRootFiles();
  const byTier = emptyTierTotals();
  let totalBytes = 0;
  for (const file of files) {
    byTier[file.tier] += file.bytes;
    totalBytes += file.bytes;
  }
  const budget = ROOT_BUDGET;
  const violations: string[] = [];
  if (byTier.S0 > budget.s0MaxBytes) {
    violations.push(`S0 default stack ${fmt(byTier.S0)} exceeds budget ${fmt(budget.s0MaxBytes)}`);
  }
  if (totalBytes > budget.totalMaxBytes) {
    violations.push(`total corpus ${fmt(totalBytes)} exceeds budget ${fmt(budget.totalMaxBytes)}`);
  }
  return { name: 'monorepo-root', root: REPO_ROOT, files, byTier, totalBytes, budget, violations };
}

function printReport(report: TargetReport) {
  console.log(`\n=== ${report.name} ===`);
  console.log(`  root: ${relative(REPO_ROOT, report.root) || '.'}`);
  const tierOrder: Tier[] = ['S0', 'S1', 'S2', 'S3', 'skills'];
  for (const tier of tierOrder) {
    console.log(`  ${tier.padEnd(6)} ${fmt(report.byTier[tier]).padStart(9)}  ${tokens(report.byTier[tier])}`);
  }
  console.log(`  ${'TOTAL'.padEnd(6)} ${fmt(report.totalBytes).padStart(9)}  ${tokens(report.totalBytes)}`);
  if (report.budget) {
    console.log(
      `  budget S0<=${fmt(report.budget.s0MaxBytes)} total<=${fmt(report.budget.totalMaxBytes)} skill<=${fmt(
        report.budget.skillMaxBytes
      )}`
    );
  }
  if (report.violations.length) {
    console.log('  ❌ VIOLATIONS:');
    for (const v of report.violations) console.log(`     - ${v}`);
  } else if (report.budget) {
    console.log('  ✅ within budget');
  }
}

function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes('--json');
  const checkMode = args.includes('--check');
  const verbose = args.includes('--verbose');

  const reports: TargetReport[] = [];
  if (existsSync(TEMPLATES_DIR)) {
    for (const dirent of readdirSync(TEMPLATES_DIR, { withFileTypes: true })) {
      if (!dirent.isDirectory()) continue;
      const budget = dirent.name.includes('cache-components') ? CACHE_COMPONENTS_BUDGET : DEFAULT_BUDGET;
      reports.push(buildReport(`template/${dirent.name}`, join(TEMPLATES_DIR, dirent.name), budget));
    }
  }
  reports.push(buildRootReport());

  if (asJson) {
    console.log(JSON.stringify(reports, null, 2));
  } else {
    for (const report of reports) {
      printReport(report);
      if (verbose) {
        for (const file of report.files) {
          console.log(`      ${String(file.bytes).padStart(6)}  [${file.tier}] ${file.path}`);
        }
      }
    }
  }

  const failed = reports.filter((r) => r.violations.length > 0);
  if (checkMode && failed.length) {
    console.error(`\n${failed.length} target(s) exceed their LLM-context budget.`);
    process.exit(1);
  }
}

main();

// Exported for tests / programmatic use.
export { buildReport, buildRootReport, classify, DEFAULT_BUDGET, CACHE_COMPONENTS_BUDGET, ROOT_BUDGET };
export type { Budget, FileEntry, TargetReport, Tier };
