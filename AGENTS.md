# AGENTS.md — AI Guidance for Sitecore Content SDK

> **Context:** This file is the **compact** guide (commands, structure, guardrails, references). Deeper topics live under [.agents/docs/](.agents/docs/) — start with [README](.agents/docs/README.md) or open the layer you need. Use [Skills.md](Skills.md) for **head-app** capability skills (templates only). [CLAUDE.md](CLAUDE.md) explains layered reading. Cursor applies [.cursor/rules/](.cursor/rules/) by glob — you do not need every rule in chat context at once.

**Scope:** This repo is the **Content SDK monorepo**. For a **generated head app**, use that app's `AGENTS.md` (not this file).

---

## Quick Commands

```bash
yarn install              # From repo root — installs all workspaces
yarn build                # Build all packages
yarn lint-packages        # Lint packages
yarn lint-samples         # Lint samples
yarn test-packages        # Run tests
yarn coverage-packages    # Coverage report
yarn api-extractor:verify # Verify public API surface (required by CI)
yarn reset                # Clean, reinstall, rebuild
```

**Per-package:** `cd packages/<name>` then `yarn build`, `yarn lint`, `yarn test`.

---

## Repository structure (compact)

```
content-sdk/
├── packages/
│   ├── core/                   # GraphQL, cache, retry, fetch
│   ├── analytics-core/         # Analytics foundation
│   ├── content/                # Layout, editing, site, media
│   ├── search/                 # Search APIs
│   ├── events/                 # Event tracking
│   ├── personalize/            # Personalization
│   ├── cli/                    # sitecore-tools CLI
│   ├── create-content-sdk-app/ # Scaffolding + templates
│   ├── nextjs/                 # Next.js integration
│   └── react/                  # React field components
├── samples/                    # Generated example apps
└── scripts/                    # Monorepo scripts
```

**Which package?** core (GraphQL/cache) · content (layout/editing) · cli · create-content-sdk-app (templates/init) · nextjs · react. Full table: [.agents/docs/AGENTS-repo-and-packages.md](.agents/docs/AGENTS-repo-and-packages.md).

**Samples:** `yarn scaffold-samples`; live template dev via `yarn watch` in create-content-sdk-app. Inside `samples/`, use that app's `AGENTS.md`.

---

## Best practices

- **Match existing patterns** in the package you edit; small, focused changes
- **TypeScript strict mode**; explicit types; JSDoc on new public APIs (`@param`, `@returns`)
- **Never import from `dist/`**; sources live in `src/**`
- **Tests:** Mocha + Sinon + Chai; update `*.test.ts` when behavior changes; run `yarn test-packages`
- **Templates:** must build with `npm install && npm run build` in generated apps; run `yarn build` after template changes
- **Security:** env vars only for API keys and endpoints; never commit `.env`; never expose secrets in client code or logs
- **Sitecore:** prefer SDK field components (`<Text>`, `<RichText>`, `<Image>`); validate fields before render

More: [RULES-code-style.md](.agents/docs/RULES-code-style.md) · [RULES-javascript.md](.agents/docs/RULES-javascript.md) · [RULES-sitecore.md](.agents/docs/RULES-sitecore.md)

---

## DO & DON'T

| DO | DON'T |
|----|-------|
| Use existing utilities and common code | Edit `dist/**` or other build output |
| Follow patterns in templates and packages | Change env vars or commit `.env` files |
| Ensure template edits build in generated apps | Add dependencies without explicit approval |
| Drive CLI flows via `Initializer.init(args)` | Modify `yarn.lock` / `package-lock.json` unless required |
| Reuse common processes (`src/common/` in create-content-sdk-app) | Rewrite folder structure without asking |
| Run `yarn build` after template changes | Touch CI or global config without explicit instruction |
| Run `yarn api-extractor` when changing public exports | Modify `.github/workflows/` without instruction |

---

## Guardrails for agentic AI

- **Preserve behavior:** Do not change public API contracts without `api-extractor` verification and tests
- **Secrets:** Never hardcode API keys, editing secrets, or tokens; use `.env.*.example` with placeholders only
- **Artifacts:** Never edit `dist/**`, `.next/`, `node_modules/`, `build/`
- **Head apps vs monorepo:** Do not copy this `AGENTS.md` into scaffolded apps; templates ship their own
- **Depth on demand:** Open one `.agents/docs/` file or one `.cursor/rules/*.mdc` for the task area — do not load the full corpus

Full safety: [RULES-safety.md](.agents/docs/RULES-safety.md). Workflows: [AGENTS-workflows.md](.agents/docs/AGENTS-workflows.md).

---

## References

- **Layered docs:** [.agents/docs/](.agents/docs/)
- **Cursor rules:** [.cursor/rules/](.cursor/rules/) (glob-scoped)
- **Head-app skills:** [Skills.md](Skills.md) → template `.agents/skills/`
- **Contributing:** `CONTRIBUTING.md`
- **MCP:** https://sitecore.mcp.kapa.ai
- **Docs:** [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html)
