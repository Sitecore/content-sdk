/**
 * Generates slim SKILL.md files for all three Next.js templates.
 * Run: npx tsx ./scripts/llm-context/generate-slim-skills.ts
 */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-console */

import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const REPO_ROOT = join(__dirname, '..', '..');
const TEMPLATES_ROOT = join(REPO_ROOT, 'packages', 'create-content-sdk-app', 'src', 'templates');

type TemplateKind = 'pages' | 'app-router' | 'cache-components';

type SkillDef = {
  id: string;
  title: string;
  description: string;
  detail: string;
  readFirst?: string;
  when: string[];
  rules: string[];
  stop: string[];
};

const DOCS = '../../docs/AGENTS-router-specifics.md';
const KEY = '../../docs/AGENTS-key-concepts.md';
const CACHE_KEY = '../../docs/AGENTS-key-concepts.md';

function skillMd(def: SkillDef, templateLabel: string): string {
  const readFirst = def.readFirst
    ? `\n**Read first:** ${def.readFirst}\n`
    : '\n';
  return `---
name: ${def.id}
description: ${def.description}
---

# ${def.title} (${templateLabel})

**Detail:** [${def.detail.split('/').pop()}](${def.detail})${readFirst}
## When

${def.when.map((w) => `- ${w}`).join('\n')}

## Rules

${def.rules.map((r) => `- ${r}`).join('\n')}

## Stop

${def.stop.map((s) => `- ${s}`).join('\n')}

Docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
`;
}

function pagesSkills(): SkillDef[] {
  return [
    {
      id: 'content-sdk-component-scaffold',
      title: 'Component scaffold',
      description:
        'Creates new Sitecore components under src/components/. Pages Router; map auto-regenerates on dev/build.',
      detail: `${DOCS}#component-map-and-layout`,
      readFirst: '`src/components/`',
      when: ['Adding a new Sitecore component from scratch', 'User asks for component file structure or props'],
      rules: [
        'Place components under `src/components/`',
        'Map regenerates during `npm run dev` / `npm run build`; run `npm run sitecore-tools:generate-map` if dev is not running',
      ],
      stop: ['Stop if unclear whether component needs client-side interactivity'],
    },
    {
      id: 'content-sdk-component-registration',
      title: 'Component registration',
      description:
        'Registers components in .sitecore/component-map.ts for Pages Router layout and editing.',
      detail: `${DOCS}#component-map-and-layout`,
      readFirst: '`.sitecore/component-map.ts`',
      when: ['Component not found in layout/editor', 'Task touches the component map'],
      rules: [
        'Every layout component must be in `.sitecore/component-map.ts`',
        'Prefer auto-generation from `src/components/`; edit manually only when generator cannot handle the case',
      ],
      stop: ['Stop if renaming map entries would break published layout without Sitecore-side update'],
    },
    {
      id: 'content-sdk-editing-safe-rendering',
      title: 'Editing-safe rendering',
      description:
        'Preview/editing for Pages Router via context.preview and context.previewData in [[...path]].tsx.',
      detail: `${DOCS}#routing-and-data-fetching`,
      when: ['Editing or preview broken', 'Component must work in Page Editor or design library'],
      rules: [
        'Use `context.preview` / `context.previewData` in getStaticProps/getServerSideProps',
        'When preview: `client.getPreview(context.previewData)` or `getDesignLibraryData(context.previewData)`',
      ],
      stop: ['Stop if changing preview flow would break editing API routes'],
    },
    {
      id: 'content-sdk-field-usage-image-link-text',
      title: 'Field usage (Text, Image, Link)',
      description: 'Renders Sitecore fields with SDK components Text, RichText, Image, Link.',
      detail: `${DOCS}#component-map-and-layout`,
      when: ['Rendering Sitecore fields', 'User mentions Text, RichText, Image, or Link'],
      rules: [
        'Use `<Text>`, `<RichText>`, `<Image>`, `<Link>` from the SDK',
        'Validate field existence before render',
      ],
      stop: ['Stop if bypassing SDK field components for user-controlled HTML without sanitization'],
    },
    {
      id: 'content-sdk-graphql-data-fetching',
      title: 'Data fetching',
      description:
        'Page/dictionary fetch via SitecoreClient in [[...path]].tsx getStaticProps/getServerSideProps.',
      detail: `${DOCS}#routing-and-data-fetching`,
      readFirst: '`src/pages/[[...path]].tsx`, `src/lib/sitecore-client.ts`',
      when: ['Fetching page or dictionary data', 'SSG paths or preview data'],
      rules: [
        'Path from `extractPath(context)`; locale from `context.locale`',
        '`client.getPage(path, { locale })` then `getDictionary` and `getComponentData`',
        'SSG paths: `client.getPagePaths(sites, context?.locales)`',
      ],
      stop: ['Stop if fetching in client components when SSR/SSG is intended'],
    },
    {
      id: 'content-sdk-route-configuration',
      title: 'Route configuration',
      description:
        'Pages Router catch-all at src/pages/[[...path]].tsx; data via getStaticProps/getServerSideProps.',
      detail: `${DOCS}#routing-and-data-fetching`,
      readFirst: '`src/pages/[[...path]].tsx`',
      when: ['Changing routing, placeholders, or Layout', 'Catch-all or _app data flow'],
      rules: [
        'Single Sitecore entry: `src/pages/[[...path]].tsx`',
        'Do not fetch Sitecore data in `_app.tsx`',
        'Use `extractPath(context)` and `context.locale`',
      ],
      stop: ['Stop if adding a second catch-all for Sitecore content'],
    },
    {
      id: 'content-sdk-site-setup-and-env',
      title: 'Site setup and env',
      description: 'sitecore.config.ts and env vars; document in .env.example only.',
      detail: `${KEY}#component-map-editing-env`,
      when: ['Configuring site, API, or env vars', 'Adding new environment variable'],
      rules: [
        'All secrets via env vars in `sitecore.config.ts`',
        'Document in `.env.example` only; never commit `.env` / `.env.local`',
      ],
      stop: ['Stop if asked to commit secrets or hardcode API keys'],
    },
    {
      id: 'content-sdk-multisite-management',
      title: 'Multisite management',
      description: 'Multisite via proxy.ts: PreviewProxy → BotTrackingProxy → MultisiteProxy → RedirectsProxy → PersonalizeProxy.',
      detail: `${DOCS}#multisite-and-edge-middleware-proxy`,
      readFirst: '`src/proxy.ts`, `.sitecore/sites.json`',
      when: ['Multisite routing, sites.json, or proxy changes'],
      rules: [
        'Proxy order fixed: Preview → BotTracking → Multisite → Redirects → Personalize',
        'Use `.sitecore/sites.json` in middleware and API routes',
        'Keep matcher excluding `/api`, `/_next`, static assets',
      ],
      stop: ['Stop if changing proxy order without explicit approval'],
    },
    {
      id: 'content-sdk-dictionary-and-i18n',
      title: 'Dictionary and i18n',
      description: 'Next.js i18n via next.config.js; locale from context.locale in data methods.',
      detail: `${DOCS}#i18n-pages-router`,
      when: ['i18n locales, dictionary, or context.locale issues'],
      rules: [
        '`next.config.js` → `i18n.locales` / `defaultLocale` aligned with Sitecore',
        'Always pass `context.locale` to `client.getPage`',
      ],
      stop: ['Stop if assuming locale from headers instead of `context.locale`'],
    },
    {
      id: 'content-sdk-sitemap-robots',
      title: 'Sitemap and robots',
      description: 'API routes src/pages/api/sitemap.ts and robots.ts with SDK middleware.',
      detail: `${DOCS}#api-routes`,
      when: ['Sitemap, robots.txt, or SEO route handlers'],
      rules: [
        'Use `SitemapMiddleware` / `RobotsMiddleware` with `sites` from `.sitecore/sites.json`',
        'Add rewrites in `next.config.js` for public URLs',
      ],
      stop: ['Stop if hardcoding site list instead of `.sitecore/sites.json`'],
    },
    {
      id: 'content-sdk-component-variants',
      title: 'Component variants',
      description: 'Multiple renderings of one component type; regenerate component map after changes.',
      detail: `${DOCS}#component-map-and-layout`,
      when: ['One component type with multiple presentations or variants'],
      rules: ['Follow existing variant patterns in `src/components/`', 'Regenerate component map after changes'],
      stop: ['Stop if variant rename would break layout without Sitecore update'],
    },
    {
      id: 'content-sdk-troubleshoot-editing',
      title: 'Troubleshoot editing',
      description: 'Debug Pages Router preview: context.preview, previewData, editing API routes.',
      detail: `${DOCS}#routing-and-data-fetching`,
      when: ['Editing, preview, or design library misbehaves'],
      rules: [
        'Check `context.preview` / `context.previewData` in `[[...path]].tsx`',
        'Verify editing routes: `src/pages/api/editing/config.ts`, `render.ts`',
      ],
      stop: ['Escalate if platform/editor issue outside app code'],
    },
    {
      id: 'content-sdk-upgrade-assistant',
      title: 'Upgrade assistant',
      description: 'Upgrade @sitecore-content-sdk/* packages; check CHANGELOG and migration guides.',
      detail: `${DOCS}`,
      when: ['Bumping SDK package versions or migration from older SDK'],
      rules: ['Check Content SDK CHANGELOG and upgrade guides', 'Run `npm run build` after upgrade'],
      stop: ['Stop if upgrade requires undocumented breaking env or config changes without user confirmation'],
    },
    {
      id: 'content-sdk-component-data-strategy',
      title: 'Component data strategy',
      description: 'Layout data from getPage/getComponentData; path/locale from extractPath/context.',
      detail: `${DOCS}#routing-and-data-fetching`,
      when: ['How component receives Sitecore data', 'BYOC or serializable props to client'],
      rules: [
        'Data from `getPage` + `getComponentData` in catch-all page',
        'Pass serializable props to client components',
        'BYOC must be registered in component map',
      ],
      stop: ['Stop if introducing a second data-fetch path without clear need'],
    },
  ];
}

function appRouterSkills(cache: boolean): SkillDef[] {
  const fetchDetail = cache
    ? `${DOCS}#data-fetching-and-preview`
    : `${DOCS}#data-fetching-and-preview`;
  const dataRule = cache
    ? 'Non-preview reads: `getSitecorePage` / `getSitecoreDictionary` from `src/lib/cache/`'
    : '`client.getPage(path ?? [], { site, locale })` in page Server Components';
  const dictRule = cache
    ? 'Dictionary via `getSitecoreDictionary` in `src/i18n/request.ts`'
    : '`client.getDictionary({ locale, site })` in `src/i18n/request.ts`';
  const previewRule = cache
    ? 'Preview: `draftMode()` + `client.getPreview` / `getDesignLibraryData` directly — never wrap in `use cache`'
    : 'Preview: `draftMode()` + `client.getPreviewData(await headers())` then `getPreview` / `getDesignLibraryData`';

  const skills: SkillDef[] = [
    {
      id: 'content-sdk-component-scaffold',
      title: 'Component scaffold',
      description:
        'Creates Sitecore components under src/components/. App Router; server/client maps auto-regenerate.',
      detail: `${DOCS}#component-maps-and-layout`,
      readFirst: '`src/components/`',
      when: ['Adding a new Sitecore component', 'Choosing Server vs Client (`use client`)'],
      rules: [
        'Place under `src/components/`',
        'Server → server map; Client → client map (generator picks by `use client`)',
        'Run `npm run sitecore-tools:generate-map` if dev is not running',
      ],
      stop: ['Stop if unclear Server vs Client — follow app convention'],
    },
    {
      id: 'content-sdk-component-registration',
      title: 'Component registration',
      description:
        'Registers components in .sitecore/component-map.ts and component-map.client.ts for App Router.',
      detail: `${DOCS}#component-maps-and-layout`,
      readFirst: '`.sitecore/component-map.ts`, `.sitecore/component-map.client.ts`',
      when: ['Component missing in editor/layout', 'Task touches component maps'],
      rules: [
        'Server components → `.sitecore/component-map.ts`',
        'Client components → `.sitecore/component-map.client.ts`',
        'Prefer auto-generation; manual edits only when generator cannot handle the case',
      ],
      stop: ['Stop if renaming map keys would break published layout'],
    },
    {
      id: 'content-sdk-editing-safe-rendering',
      title: 'Editing-safe rendering',
      description:
        'Preview/editing via draftMode() and getPreview/getDesignLibraryData in App Router pages.',
      detail: fetchDetail,
      when: ['Editing, preview, or design library behavior'],
      rules: [previewRule, 'Use SDK field components in layout placeholders'],
      stop: [cache ? 'Never wrap preview reads in `use cache`' : 'Stop if bypassing draftMode for preview'],
    },
    {
      id: 'content-sdk-field-usage-image-link-text',
      title: 'Field usage (Text, Image, Link)',
      description: 'Renders Sitecore fields with SDK Text, RichText, Image, Link components.',
      detail: `${DOCS}#component-maps-and-layout`,
      when: ['Rendering Sitecore fields'],
      rules: ['Use SDK field components', 'Validate fields before render'],
      stop: ['Stop if rendering unsanitized external HTML'],
    },
    {
      id: 'content-sdk-graphql-data-fetching',
      title: 'Data fetching',
      description: cache
        ? 'Cached reads via src/lib/cache helpers; preview via client directly.'
        : 'Page/dictionary via SitecoreClient; SSG via getAppRouterStaticParams.',
      detail: fetchDetail,
      readFirst: cache
        ? '`src/lib/cache/get-sitecore-page.ts`, `src/lib/sitecore-client.ts`'
        : '`src/app/[site]/[locale]/[[...path]]/page.tsx`, `src/lib/sitecore-client.ts`',
      when: ['Page or dictionary fetch', 'generateStaticParams / SSG'],
      rules: [
        dataRule,
        dictRule,
        cache
          ? 'SSG: `getAppRouterStaticParams` when `generateStaticPaths` true; else `BUILD_VALIDATION_SITE` placeholder — never `return []`'
          : 'SSG: `getAppRouterStaticParams` when `generateStaticPaths` true; else `return []`',
        previewRule,
      ],
      stop: [cache ? 'Stop if calling `client.getPage` directly in pages/i18n' : 'Stop if fetching in client components'],
    },
    {
      id: 'content-sdk-route-configuration',
      title: 'Route configuration',
      description:
        'App Router catch-all at src/app/[site]/[locale]/[[...path]]/page.tsx; setRequestLocale required.',
      detail: `${DOCS}#routing-site--locale--path`,
      readFirst: '`src/app/[site]/[locale]/[[...path]]/page.tsx`',
      when: ['Routing, layouts, placeholders', 'setRequestLocale or catch-all changes'],
      rules: [
        'Single Sitecore page entry: `[site]/[locale]/[[...path]]/page.tsx`',
        'Call `setRequestLocale(`${site}_${locale}`)` at top of page',
        'Await `params` (Promise in Next.js 15+)',
      ],
      stop: ['Stop if adding a second catch-all for Sitecore pages'],
    },
    {
      id: 'content-sdk-site-setup-and-env',
      title: 'Site setup and env',
      description: 'sitecore.config.ts and env vars; document in .env.example only.',
      detail: `${KEY}#component-maps-editing-env`,
      when: ['Site config, API endpoints, env vars'],
      rules: [
        'Env-only config in `sitecore.config.ts`',
        cache ? 'Keep SDK dictionary cache disabled (`dictionary.caching.enabled: false`)' : 'Document vars in `.env.example` only',
      ],
      stop: ['Stop if asked to commit secrets'],
    },
    {
      id: 'content-sdk-multisite-management',
      title: 'Multisite management',
      description: cache
        ? 'Proxy: PreviewProxy → BotTracking → Locale → Multisite → Redirects → Personalize.'
        : 'Proxy: PreviewProxy → BotTracking → Locale → Multisite → Redirects → Personalize.',
      detail: `${DOCS}#multisite-and-edge-middleware-proxy`,
      readFirst: '`src/proxy.ts`, `.sitecore/sites.json`',
      when: ['Multisite, sites.json, proxy matcher'],
      rules: [
        cache
          ? 'Order: Preview → BotTracking → Locale → Multisite → Redirects → Personalize'
          : 'Order: Preview → BotTracking → Locale → Multisite → Redirects → Personalize',
        '`.sitecore/sites.json` from CLI `generateSites`',
        'Do not change proxy order',
      ],
      stop: ['Stop if changing proxy order'],
    },
    {
      id: 'content-sdk-dictionary-and-i18n',
      title: 'Dictionary and i18n',
      description: 'next-intl with requestLocale = `${site}_${locale}`; routing.ts + request.ts.',
      detail: `${DOCS}#i18n-next-intl`,
      when: ['Locale, dictionary, or next-intl issues'],
      rules: [
        '`setRequestLocale(`${site}_${locale}`)` in page',
        'Parse `requestLocale` in `src/i18n/request.ts`',
        dictRule,
      ],
      stop: ['Stop if changing `{site}_{locale}` convention without updating all callers'],
    },
    {
      id: 'content-sdk-sitemap-robots',
      title: 'Sitemap and robots',
      description: 'Route handlers under src/app/api/ with createSitemapRouteHandler / createRobotsRouteHandler.',
      detail: `${DOCS}#api-route-handlers`,
      when: ['Sitemap or robots handlers'],
      rules: [
        '`createSitemapRouteHandler` / `createRobotsRouteHandler` with `sites` from `.sitecore/sites.json`',
        'Rewrites in `next.config.ts` for `/sitemap*.xml`, `/robots.txt`',
      ],
      stop: ['Stop if hardcoding site list'],
    },
    {
      id: 'content-sdk-component-variants',
      title: 'Component variants',
      description: 'Multiple presentations per component; regenerate maps after changes.',
      detail: `${DOCS}#component-maps-and-layout`,
      when: ['Component variants or alternate renderings'],
      rules: ['Mirror existing variant patterns', 'Regenerate component maps'],
      stop: ['Stop if variant change breaks layout item without Sitecore update'],
    },
    {
      id: 'content-sdk-troubleshoot-editing',
      title: 'Troubleshoot editing',
      description: cache
        ? 'Check draftMode, preview on client (not cache helpers), setRequestLocale, maps.'
        : 'Check draftMode, getPreviewData(headers), setRequestLocale, getCachedPageParams, maps.',
      detail: fetchDetail,
      when: ['Editing/preview/design library broken'],
      rules: [
        '`await draftMode()` in Server Components',
        previewRule,
        'Verify component maps and editing API routes under `src/app/api/editing/`',
      ],
      stop: ['Escalate if editor/platform issue outside app'],
    },
    {
      id: 'content-sdk-upgrade-assistant',
      title: 'Upgrade assistant',
      description: 'Upgrade @sitecore-content-sdk/*; follow CHANGELOG and migration guides.',
      detail: `${DOCS}`,
      when: ['SDK version bump or migration'],
      rules: ['Read CHANGELOG', 'Run `npm run build` after upgrade'],
      stop: ['Stop if breaking change needs user confirmation'],
    },
    {
      id: 'content-sdk-component-data-strategy',
      title: 'Component data strategy',
      description: cache
        ? 'Cached layout data via cache helpers; preview via client; site/locale from params.'
        : 'Layout from getPage; site/locale from route params; serializable client props.',
      detail: fetchDetail,
      when: ['Component props / data flow', 'BYOC registration'],
      rules: [
        dataRule,
        'Pass `{ site, locale }` from `await params`',
        'Client components get serializable props only',
      ],
      stop: ['Stop if adding parallel fetch path'],
    },
  ];

  if (cache) {
    skills.push({
      id: 'content-sdk-cache-components-and-osr',
      title: 'Cache Components and OSR',
      description:
        'Tag-based caching in src/lib/cache/ and POST /api/revalidate webhook for on-demand invalidation.',
      detail: `${DOCS}#on-demand-revalidation-post-apirevalidate`,
      readFirst: '`src/lib/cache/`, `src/app/api/revalidate/route.ts`',
      when: ['Stale content', 'Adding cache helper', 'Webhook / revalidation setup'],
      rules: [
        "Cache helpers use `'use cache'` + `cacheTag` with `sc:route` / `sc:item` / `sc:dict` tags",
        '`POST /api/revalidate` accepts `updates[]` and `tags[]`',
        'Optional `SITECORE_REVALIDATE_SECRET` + `x-revalidate-secret` header',
        'Do not call `revalidateTag` from components',
      ],
      stop: ['Stop if re-enabling SDK in-process dictionary cache'],
    });
  }

  return skills;
}

function writeSkills(templateDir: string, kind: TemplateKind, label: string) {
  const defs = kind === 'pages' ? pagesSkills() : appRouterSkills(kind === 'cache-components');
  for (const def of defs) {
    const dir = join(TEMPLATES_ROOT, templateDir, '.agents', 'skills', def.id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'SKILL.md'), skillMd(def, label), 'utf8');
  }
  console.log(`Wrote ${defs.length} skills → ${templateDir}`);
}

function skillsIndexMd(
  kind: TemplateKind,
  rows: Array<{ id: string; when: string }>
): string {
  const intro =
    kind === 'pages'
      ? 'Pages Router app with `[[...path]].tsx`, Next.js i18n (`context.locale`), single component map.'
      : kind === 'cache-components'
        ? 'App Router + Cache Components (`src/lib/cache/`, `POST /api/revalidate`).'
        : 'App Router with `[site]`/`[locale]`, next-intl, server/client component maps.';

  return `# Skills.md — Capability index

${intro} Load **one** skill per task from [.agents/skills/](.agents/skills/). Full guidance: [AGENTS.md](AGENTS.md), [.agents/docs/](.agents/docs/).

| Skill | Use when |
|-------|----------|
${rows.map((r) => `| [${r.id}](.agents/skills/${r.id}/SKILL.md) | ${r.when} |`).join('\n')}

Do **not** load every skill at session start. Open [AGENTS.md](AGENTS.md) first; add one skill when the task matches a row above.

Official docs: [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html).
`;
}

function writeSkillsIndex(templateDir: string, kind: TemplateKind) {
  const defs = kind === 'pages' ? pagesSkills() : appRouterSkills(kind === 'cache-components');
  const rows = defs.map((d) => ({ id: d.id, when: d.description.split('.')[0] }));
  writeFileSync(join(TEMPLATES_ROOT, templateDir, 'Skills.md'), skillsIndexMd(kind, rows), 'utf8');
}

writeSkills('nextjs', 'pages', 'Pages Router');
writeSkills('nextjs-app-router', 'app-router', 'App Router');
writeSkills('nextjs-app-router-cache-components', 'cache-components', 'App Router + Cache Components');

writeSkillsIndex('nextjs', 'pages');
writeSkillsIndex('nextjs-app-router', 'app-router');
writeSkillsIndex('nextjs-app-router-cache-components', 'cache-components');

console.log('Done.');
