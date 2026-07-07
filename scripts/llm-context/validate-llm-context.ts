/**
 * Validation gate for JSS-9247 LLM context slimming.
 *
 * Runs:
 *  1. Budget check (templates + monorepo root)
 *  2. Scaffold test — generate all 3 templates; verify slim corpus ships
 *  3. Functional regression matrix — key guidance present for agent tasks
 *
 * Usage:
 *   tsx ./scripts/llm-context/validate-llm-context.ts
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-console */

import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';
import { spawnSync } from 'child_process';

const REPO_ROOT = resolve(__dirname, '..', '..');
const SCAFFOLD_OUT = join(REPO_ROOT, '.tmp', 'llm-context-scaffold-test');

const TEMPLATES = [
  'nextjs',
  'nextjs-app-router',
  'nextjs-app-router-cache-components',
] as const;

type TemplateName = (typeof TEMPLATES)[number];

/** Files that must exist in every scaffolded head app after slimming. */
const REQUIRED_SHIPPED_FILES = [
  'AGENTS.md',
  'CLAUDE.md',
  'Skills.md',
  'copilot-instructions.md',
  '.windsurfrules',
  '.agents/docs/README.md',
  '.agents/docs/AGENTS-key-concepts.md',
  '.agents/docs/AGENTS-router-specifics.md',
  '.agents/docs/AGENTS-workflows-and-boundaries.md',
  '.agents/skills/content-sdk-component-scaffold/SKILL.md',
  '.agents/skills/content-sdk-graphql-data-fetching/SKILL.md',
  '.cursor/rules/javascript.mdc',
  '.cursor/rules/sitecore.mdc',
] as const;

type RegressionCase = {
  id: string;
  templates: TemplateName[];
  /** All patterns must match somewhere in the template's AI corpus (S0–S3 + skills). */
  patterns: RegExp[];
};

const REGRESSION_MATRIX: RegressionCase[] = [
  {
    id: 'add-component',
    templates: TEMPLATES as unknown as TemplateName[],
    patterns: [/src\/components/i, /component-map/i, /generate-map/i],
  },
  {
    id: 'fix-preview-app-router',
    templates: ['nextjs-app-router'],
    patterns: [/draftMode/i, /getPreviewData/i, /getPreview/i],
  },
  {
    id: 'fix-preview-pages',
    templates: ['nextjs'],
    patterns: [/context\.preview/i, /previewData/i, /getPreview/i],
  },
  {
    id: 'fix-preview-cache',
    templates: ['nextjs-app-router-cache-components'],
    patterns: [/draftMode/i, /getPreview/i, /never wrap.*use cache|not cached|directly/i],
  },
  {
    id: 'add-api-route-app-router',
    templates: ['nextjs-app-router', 'nextjs-app-router-cache-components'],
    patterns: [/src\/app\/api/i, /matcher/i],
  },
  {
    id: 'add-api-route-pages',
    templates: ['nextjs'],
    patterns: [/src\/pages\/api/i, /rewrites/i],
  },
  {
    id: 'i18n-app-router',
    templates: ['nextjs-app-router', 'nextjs-app-router-cache-components'],
    patterns: [/setRequestLocale/i, /request\.ts/i, /\{site\}_\{locale\}/],
  },
  {
    id: 'i18n-pages',
    templates: ['nextjs'],
    patterns: [/context\.locale/i, /i18n\.locales/i],
  },
  {
    id: 'multisite-proxy',
    templates: TEMPLATES as unknown as TemplateName[],
    patterns: [/proxy\.ts/i, /sites\.json/i, /PreviewProxy|MultisiteProxy|LocaleProxy|AppRouterMultisiteProxy/],
  },
  {
    id: 'ssg-app-router',
    templates: ['nextjs-app-router'],
    patterns: [/getAppRouterStaticParams/i, /return \[\]/],
  },
  {
    id: 'ssg-pages',
    templates: ['nextjs'],
    patterns: [/getStaticPaths/i, /getPagePaths/i],
  },
  {
    id: 'cache-components-osr',
    templates: ['nextjs-app-router-cache-components'],
    patterns: [
      /BUILD_VALIDATION_SITE|_DEFAULT_/,
      /getSitecorePage/i,
      /POST \/api\/revalidate|\/api\/revalidate/i,
      /SITECORE_REVALIDATE_SECRET/i,
    ],
  },
];

const AI_EXTENSIONS = ['.md', '.mdc'];
const AI_NAMES = ['.windsurfrules', 'copilot-instructions.md'];

function isAiFile(name: string): boolean {
  if (AI_NAMES.includes(name)) return true;
  return AI_EXTENSIONS.some((ext) => name.endsWith(ext));
}

function collectAiCorpus(root: string): string {
  const parts: string[] = [];
  function walk(dir: string) {
    for (const ent of readdirSync(dir, { withFileTypes: true })) {
      if (ent.isSymbolicLink()) continue;
      const abs = join(dir, ent.name);
      if (ent.isDirectory()) {
        if (['node_modules', 'dist', '.next', '.git'].includes(ent.name)) continue;
        walk(abs);
        continue;
      }
      if (!ent.isFile() || !isAiFile(ent.name)) continue;
      parts.push(readFileSync(abs, 'utf8'));
    }
  }
  if (existsSync(root)) walk(root);
  return parts.join('\n');
}

function runBudgetCheck(): boolean {
  console.log('\n=== Gate 1: measure-llm-context:check ===');
  const result = spawnSync('npx', ['tsx', './scripts/llm-context/measure-llm-context.ts', '--check'], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
  });
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  const ok = result.status === 0;
  console.log(ok ? '✅ budget check passed' : '❌ budget check failed');
  return ok;
}

async function scaffoldTemplates(): Promise<boolean> {
  console.log('\n=== Gate 2: scaffold test ===');
  rmSync(SCAFFOLD_OUT, { recursive: true, force: true });
  mkdirSync(SCAFFOLD_OUT, { recursive: true });

  const { initialize } = await import(
    join(REPO_ROOT, 'packages', 'create-content-sdk-app', 'dist', 'initialize.js')
  );

  let ok = true;
  for (const template of TEMPLATES) {
    const dest = join(SCAFFOLD_OUT, template);
    mkdirSync(dest, { recursive: true });
    console.log(`  Scaffolding ${template} → ${relative(REPO_ROOT, dest)}`);
    try {
      await initialize(template, {
        template,
        destination: dest,
        yes: true,
        force: true,
        silent: true,
        noInstall: true,
        prerender: 'SSG',
      });
    } catch (err) {
      console.error(`  ❌ scaffold failed for ${template}:`, err);
      ok = false;
      continue;
    }

    for (const rel of REQUIRED_SHIPPED_FILES) {
      const abs = join(dest, rel);
      if (!existsSync(abs)) {
        console.error(`  ❌ missing shipped file: ${template}/${rel}`);
        ok = false;
      }
    }

    // alwaysApply: exactly one setup rule per template
    const rulesDir = join(dest, '.cursor', 'rules');
    if (existsSync(rulesDir)) {
      const alwaysApplyCount = readdirSync(rulesDir)
        .filter((f) => f.endsWith('.mdc'))
        .filter((f) => /alwaysApply:\s*true/.test(readFileSync(join(rulesDir, f), 'utf8').slice(0, 400)))
        .length;
      if (alwaysApplyCount !== 1) {
        console.error(`  ❌ ${template}: expected 1 alwaysApply rule, found ${alwaysApplyCount}`);
        ok = false;
      }
    }

    // Thin S3 pointers (not bloated duplicates)
    for (const pointer of ['copilot-instructions.md', '.windsurfrules'] as const) {
      const abs = join(dest, pointer);
      if (existsSync(abs)) {
        const kb = statSync(abs).size / 1024;
        if (kb > 3) {
          console.error(`  ❌ ${template}/${pointer} is ${kb.toFixed(1)} KB (expected thin pointer < 3 KB)`);
          ok = false;
        }
      }
    }

    const agentsKb = existsSync(join(dest, 'AGENTS.md'))
      ? statSync(join(dest, 'AGENTS.md')).size / 1024
      : 0;
    console.log(`  ${template}: AGENTS.md ${agentsKb.toFixed(1)} KB, corpus OK`);
  }

  console.log(ok ? '✅ scaffold test passed' : '❌ scaffold test failed');
  return ok;
}

function runRegressionMatrix(): boolean {
  console.log('\n=== Gate 3: functional regression matrix ===');
  let ok = true;

  for (const template of TEMPLATES) {
    const templateRoot = join(
      REPO_ROOT,
      'packages',
      'create-content-sdk-app',
      'src',
      'templates',
      template
    );
    const scaffoldRoot = join(SCAFFOLD_OUT, template);
    const corpus = collectAiCorpus(templateRoot) + '\n' + collectAiCorpus(scaffoldRoot);

    const cases = REGRESSION_MATRIX.filter((c) => c.templates.includes(template));
    for (const testCase of cases) {
      const missing = testCase.patterns.filter((p) => !p.test(corpus));
      if (missing.length) {
        console.error(
          `  ❌ ${template} / ${testCase.id}: missing patterns ${missing.map((p) => p.source).join(', ')}`
        );
        ok = false;
      } else {
        console.log(`  ✅ ${template} / ${testCase.id}`);
      }
    }
  }

  console.log(ok ? '✅ regression matrix passed' : '❌ regression matrix failed');
  return ok;
}

async function main() {
  console.log('JSS-9247 LLM context validation\n');

  const g1 = runBudgetCheck();
  const g2 = await scaffoldTemplates();
  const g3 = runRegressionMatrix();

  const allOk = g1 && g2 && g3;
  console.log(`\n${allOk ? '✅ ALL VALIDATION GATES PASSED' : '❌ VALIDATION FAILED'}`);
  process.exit(allOk ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
