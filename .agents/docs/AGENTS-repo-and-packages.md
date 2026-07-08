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
│   ├── create-content-sdk-app/ # Scaffolding CLI + Next.js templates
│   ├── nextjs/                 # Next.js integration, middleware, editing
│   └── react/                  # React components (Text, Image, Placeholder, etc.)
├── samples/                    # Example applications (generated from templates)
└── scripts/                    # Monorepo scripts (scaffold, lint, hooks)
```

**Key locations:**

- Sources: `src/**` per package
- Templates: `packages/create-content-sdk-app/src/templates/`
- Initializers: `packages/create-content-sdk-app/src/initializers/` via `Initializer.init(args)`
- Env: `.env.*.example` only; never commit `.env`

**create-content-sdk-app** (primary focus for template work):

```
packages/create-content-sdk-app/
├── src/
│   ├── common/
│   ├── initializers/
│   ├── templates/
│   └── index.ts
├── dist/
├── types/
└── scripts/
```

- Templates are copied to generated apps; self-contained; use `.env.*.example` for env values
- Each initializer exposes `init(args)`; reuse common processes/utilities
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
| Scaffolding, templates, init flow | `packages/create-content-sdk-app` |
| Next.js integration, middleware, editing | `packages/nextjs` |
| React components (Text, Image, Placeholder, etc.) | `packages/react` |

## Working with samples

- `yarn scaffold-samples` — generate samples from templates
- Live template dev: copy `watch.json.example` → `watch.json`, set `destination` under `samples/`, run `yarn watch` from `packages/create-content-sdk-app`
- `yarn lint-samples` — lint scaffolded apps
- **When working inside a scaffolded app** (e.g. under `samples/`), use that app's **AGENTS.md** for app-level guidance

## Capability skills (head apps)

Skills are maintained in templates only. See root [Skills.md](../../Skills.md) for links to each template's `Skills.md` and `.agents/skills/`.
