# JSS-9247 — AI Context Bloat in Content SDK Starters

**Ticket:** [JSS-9247](https://sitecore.atlassian.net/browse/JSS-9247) — *"Current Agentic Support blows up AI Context"*
**Prior art:** [PR #426](https://github.com/Sitecore/content-sdk/pull/426) (`poc/better-llm-context`, closed — "needs a rework")
**Branch:** `feature/JSS-9247-reduce-llm-context-bloat`

> Working doc: baseline numbers, root cause, plan, and validation gates. Numbers are produced by `yarn measure-llm-context` (`scripts/llm-context/measure-llm-context.ts`).

---

## The problem

Loading a scaffolded starter fills an AI tool's context with ~40k tokens of guidance **before any source code is read**. The cause is not one oversized file — it is the **same guidance duplicated across 6–7 parallel layers**, several of which tools auto-load at session start.

## Load tiers (how we classify guidance)

| Tier | Files | Loaded |
|------|-------|--------|
| **S0** default | `AGENTS.md`, `CLAUDE.md`, always-apply `.cursor/rules/*.mdc` | Every session |
| **S1** index | `Skills.md` | To route a task |
| **S2** depth | `.agents/docs/*`, glob-scoped `.cursor/rules/*` | On demand |
| **S3** tool | `.windsurfrules`, `copilot-instructions.md` | Per IDE only |
| **skills** | `.agents/skills/**/SKILL.md` | Ideally one per task |

## Baseline (dev, before changes)

| Target | S0 | Total | ~Tokens (total) |
|--------|----|-------|-----------------|
| `template/nextjs` | 22.3 KB | 81.7 KB | ~20,900 |
| `template/nextjs-app-router` | 25.7 KB | 92.2 KB | ~23,600 |
| `template/nextjs-app-router-cache-components` | **38.3 KB** | **137.4 KB** | **~35,200** |
| `monorepo-root` | 17.3 KB | 43.9 KB | ~11,200 |

## After Part B (tool-file dedup)

Collapsed `copilot-instructions.md` and `.windsurfrules` to thin pointers (all 3 templates + monorepo root).

| Target | S3 before → after | Total before → after | ~Tokens saved |
|--------|-----------------|----------------------|---------------|
| `template/nextjs` | 10.7 → 1.7 KB | 81.7 → 72.7 KB | ~2,300 |
| `template/nextjs-app-router` | 16.5 → 1.7 KB | 92.2 → 77.4 KB | ~3,800 |
| `template/nextjs-app-router-cache-components` | 22.0 → 2.0 KB | 137.4 → 117.3 KB | ~5,100 |
| `monorepo-root` | 12.9 → 0.6 KB | 43.9 → 31.7 KB | ~3,100 |

S0 unchanged (expected — Part B only touches S3). Next phases target S0/S1/skills.

## After Phase C (AGENTS.md layering)

Split monolithic `AGENTS.md` into slim S0 core + `.agents/docs/` on-demand layers (all 3 templates). Full guidance preserved; depth moved to S2.

| Target | S0 before → after | ~S0 tokens saved | AGENTS.md before → after |
|--------|-------------------|------------------|--------------------------|
| `template/nextjs` | 22.3 → **12.1 KB** | ~2,600 | 17.7 → 7.2 KB |
| `template/nextjs-app-router` | 25.7 → **13.7 KB** | ~3,100 | 20.5 → 8.3 KB |
| `template/nextjs-app-router-cache-components` | 38.3 → **17.6 KB** | ~5,300 | 31.8 → 10.6 KB |

Total corpus grows slightly (content moved to S2 `.agents/docs/`, not deleted). **Session-start load (S0) drops ~46–54%.**

## After Phases D–F (skills, CLAUDE.md, cursor rules)

| Target | S0 final | Total final | ~Tokens (total) | Budget |
|--------|----------|-------------|-----------------|--------|
| `template/nextjs` | **8.5 KB** (was 22.3) | **39.6 KB** (was 81.7) | ~10,100 | ✅ |
| `template/nextjs-app-router` | **9.6 KB** (was 25.7) | **43.0 KB** (was 92.2) | ~11,000 | ✅ |
| `template/nextjs-app-router-cache-components` | **12.0 KB** (was 38.3) | **57.6 KB** (was 137.4) | ~14,700 | ✅ |
| `monorepo-root` | 16.5 KB | 30.6 KB | ~7,800 | ❌ S0/total |

**All three templates pass `measure-llm-context:check`.** Combined: ~58% smaller total corpus; ~62% smaller S0.

## After monorepo root alignment (quality-preserving)

Relocated full rule depth to `.agents/docs/` (S2 on-demand); one `alwaysApply` rule (`monorepo-setup.mdc`); slim glob-scoped `.cursor/rules/*.mdc` cards. **No guidance deleted.**

| Target | S0 final | Total final | ~Tokens (total) | Budget |
|--------|----------|-------------|-----------------|--------|
| `monorepo-root` | **6.5 KB** (was 16.5) | **38.2 KB** (was 30.6) | ~9,800 | ✅ |

Total corpus grew vs pre-layering because depth was **preserved** in `.agents/docs/` rather than stripped. Session-start (S0) dropped **61%** — the metric that matters for monorepo agents.

Worst-case session (everything auto-loaded + monorepo rules + skills) plausibly reaches the ~40k tokens reported in the ticket.

## Root causes

1. **`CLAUDE.md` amplifies load** — instructs agents to read AGENTS.md + all rules + all skills at session start.
2. **Duplication across tiers** — `Skills.md`, 14× `SKILL.md`, and `AGENTS.md` repeat the same capability text; `.windsurfrules` and `copilot-instructions.md` are near-duplicates of each other (~13 KB each).
3. **Tool auto-injection** — Cursor attaches `.cursor/rules/` and skill descriptions regardless of agent intent, so "load one skill" guidance is not enough on its own.
4. **cache-components template** is the worst offender and was not addressed by PR #426.

## Plan

- **A. Tiers + budgets** — encode tiers in the measurement script; CI gate (`measure-llm-context:check`) fails on regrowth.
- **B. De-duplicate tool files** — collapse `copilot-instructions.md` + `.windsurfrules` to thin pointers (root already does this well in `.github/copilot-instructions.md`).
- **C. Slim `AGENTS.md`** — keep commands, DO/DON'T, guardrails, boundaries; move routing/i18n/proxy/API depth to `.agents/docs/`.
- **D. Slim skills** — `Skills.md` becomes an index; each `SKILL.md` becomes a ≤ ~30-line card (when / rules / stop + one link).
- **E. Fix `CLAUDE.md`** — "start with AGENTS.md; open one doc/skill on demand; do not load everything."
- **F. Cursor rules** — one minimal `alwaysApply: true` rule; glob-scope the rest.
- **G. Accuracy pass** — diff slimmed content vs `dev` for SSG, component-map, proxy order, `setRequestLocale`, cache-components specifics.
- **H. Apply to all three templates + root.**

## Validation gates

1. **Quantitative:** `yarn measure-llm-context:check` passes for all targets (budgets in the script).
2. **Accuracy:** See [JSS-9247-accuracy-pass.md](JSS-9247-accuracy-pass.md) — high-risk areas verified vs source; 5 fixes applied (4 app-router/pages, 0 cache-components).
3. **Scaffold test:** generate an app from each template; confirm the slim corpus ships. See [JSS-9247-validation-results.md](JSS-9247-validation-results.md). Run: `yarn validate-llm-context` (requires `npm run build` in `create-content-sdk-app` first).
4. **Functional regression matrix:** for each template, key agent-task guidance verified by `validate-llm-context.ts`. ✅ Passed 2026-07-07.
5. **Before/after session:** reproduce the ticket scenario in Cursor; target ≥ 50% reduction in session-start context, 0 functional regressions.

## Target end-state (budgets)

| Target | S0 max | Total max |
|--------|--------|-----------|
| `nextjs`, `nextjs-app-router` | 14 KB | 80 KB |
| `nextjs-app-router-cache-components` | 16 KB | 110 KB |
| `monorepo-root` | 14 KB | 42 KB |

Budgets are set to catch regression first; tighten as slimming lands.
