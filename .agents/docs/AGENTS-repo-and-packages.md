# Repository structure and packages

## Layout

```
content-sdk/
├── packages/
│   ├── core/                   # @sitecore-content-sdk/core — GraphQL client, cache, retry, fetch. No SDK deps.
│   ├── analytics-core/         # Analytics foundation. No SDK deps.
│   ├── content/                # Content client: layout, editing, site, media. Depends on core.
│   ├── search/                 # Search service and APIs. Depends on core.
│   ├── events/                 # Event tracking. Depends on analytics-core.
│   ├── personalize/            # Personalization. Depends on analytics-core, events.
│   ├── cli/                    # CLI (sitecore-tools). Depends on content.
│   ├── create-content-sdk-app/ # Scaffolding CLI (registry, init flow, transform)
│   ├── nextjs/                 # Next.js integration, middleware, editing
│   └── react/                  # React components (Text, Image, Placeholder, etc.)
├── templates/                  # Versioned template packages consumed by create-content-sdk-app
│   ├── nextjs/                 # @sitecore-content-sdk/nextjs-templates — nextjs, nextjs-app-router, nextjs-app-router-cache-components
│   └── angular/                # @sitecore-content-sdk/angular-templates — angular
├── samples/                    # Example applications (generated from templates)
└── scripts/                    # Monorepo scripts (scaffold, lint, hooks)
```

**Key locations:**

- Sources: `src/**` per package
- Templates: `templates/<product>/src/templates/<template>/`
- Initializers: `templates/<product>/src/initializers/<template>.ts` — `ScaffoldInitData` objects (type from `@sitecore-content-sdk/cli/scaffolding`)
- Scaffolding CLI: `packages/create-content-sdk-app/src/` (`registry.ts`, `initialize.ts`, `common/`)
- Env: `.env.*.example` only; never commit `.env`

**Template packages** (primary focus for template work), one per product:

```
templates/<product>/            # e.g. templates/nextjs → @sitecore-content-sdk/nextjs-templates
├── src/
│   ├── initializers/
│   │   ├── common.ts           # shared prompts, readVersions()
│   │   └── <template>.ts       # ScaffoldInitData: name, prompts, templatePath, versions
│   ├── templates/
│   │   └── <template>/         # files copied (ejs-rendered) into generated apps
│   └── index.ts                # default export: array of initializers
├── scripts/build-templates.ts  # copies src/templates → dist/templates
└── package.json
```

- Template package **major** version matches its product package's major (e.g. `nextjs-templates@2.x` ↔ `@sitecore-content-sdk/nextjs@2.x`); minor/patch are bumped independently, so a template-only change doesn't require a product release (and vice versa)
- `@sitecore-content-sdk/*` devDependencies in the template package define the versions stamped into scaffolded apps
- Templates are copied to generated apps; self-contained; use `.env.*.example` for env values
- Add a template: create `src/templates/<template>/`, add `src/initializers/<template>.ts`, and export it from `src/index.ts`

**create-content-sdk-app** (CLI only — no templates):

```
packages/create-content-sdk-app/
├── src/
│   ├── common/        # base args/prompts, InitContext, transform process, utils
│   ├── registry.ts    # resolves initializers; installs <product>-templates@<major> for --majorVersion
│   ├── initialize.ts  # runs prompts + transform for the resolved initializer
│   └── bin.ts
└── scripts/watch-templates.ts
```

- Never edit `dist/**` (compiled output)

## Which package to edit?

| Task | Package |
|------|---------|
| GraphQL, cache, retry, fetch utilities | `packages/core` |
| Analytics foundation | `packages/analytics-core` |
| Content fetching, layout, editing, site, media | `packages/content` |
| Search service | `packages/search` |
| Event tracking | `packages/events` |
| Personalization | `packages/personalize` |
| CLI (sitecore-tools) | `packages/cli` |
| Template files, initializers, scaffolded SDK versions | `templates/<product>` (`templates/nextjs`, `templates/angular`) |
| Scaffolding CLI flow, registry, transform | `packages/create-content-sdk-app` |
| Scaffolding contract (`ScaffoldInitData`) | `packages/cli/src/scaffolding` |
| Next.js integration, middleware, editing | `packages/nextjs` |
| React components (Text, Image, Placeholder, etc.) | `packages/react` |

## Working with samples

- `yarn scaffold-samples` — generate samples from templates
- Live template dev: copy `watch.json.example` → `watch.json`, set `destination` under `samples/`, run `yarn watch` from `packages/create-content-sdk-app` (watches `templates/*/src/templates`)
- `yarn lint-samples` — lint scaffolded apps
- **When working inside a scaffolded app** (e.g. under `samples/`), use that app's **AGENTS.md** for app-level guidance

## Capability skills (head apps)

Skills are maintained in templates only. See root [Skills.md](../../Skills.md) for links to each template's `Skills.md` and `.agents/skills/`.
