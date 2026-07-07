# JSS-9247 — PR evidence (measurable impact)

**Ticket:** [JSS-9247](https://sitecore.atlassian.net/browse/JSS-9247)  
**Generated:** 2026-07-07 · Reproduce: `npx tsx ./scripts/llm-context/measure-llm-context.ts`

---

## Executive summary (paste into PR)

This fix addresses **~40k tokens of AI guidance loading before any source code** in scaffolded Content SDK starters ([JSS-9247](https://sitecore.atlassian.net/browse/JSS-9247)).

**Approach:** Layer guidance into tiers — slim session-start stack (S0), on-demand depth (`.agents/docs/`), one skill per task. **No guidance deleted**; relocated to load on demand.

| Metric | Before (`dev`) | After (this PR) | Change |
|--------|----------------|-----------------|--------|
| **Session-start (S0)** — worst template | 38.3 KB (~9,800 tok) | **12.0 KB (~3,100 tok)** | **−69%** |
| **Session-start (S0)** — app-router | 25.7 KB (~6,600 tok) | **10.3 KB (~2,600 tok)** | **−60%** |
| **Total guidance corpus** — worst template | 137.4 KB (~35,200 tok) | **57.6 KB (~14,700 tok)** | **−58%** |
| **Scaffolded `AGENTS.md`** — cache-components | ~31 KB monolithic | **10.4 KB** layered | **−66%** |
| **Always-apply Cursor rules** — templates | 2+ bloated rules | **1** slim setup rule | fixed |
| **Validation** | — | 3/3 gates pass | `validate-llm-context` |

**Quality preserved:** Accuracy pass vs source code; functional regression matrix (18 scenarios); full depth in `.agents/docs/` (S2).

---

## Primary metric: session-start load (S0)

What Cursor / Claude Code auto-injects **every session**: `AGENTS.md` + `CLAUDE.md` + `alwaysApply` `.cursor/rules`.

| Template | S0 before | S0 after | Δ bytes | Δ % | ~Tokens before → after |
|----------|-----------|----------|---------|-----|-------------------------|
| `nextjs` | 22.3 KB | **8.9 KB** | −13.4 KB | **−60%** | ~5,700 → ~2,300 |
| `nextjs-app-router` | 25.7 KB | **10.3 KB** | −15.4 KB | **−60%** | ~6,600 → ~2,600 |
| `nextjs-app-router-cache-components` | **38.3 KB** | **12.0 KB** | **−26.3 KB** | **−69%** | **~9,800 → ~3,100** |
| `monorepo-root` | 17.3 KB | **6.5 KB** | −10.8 KB | **−62%** | ~4,400 → ~1,700 |

> Token estimate: bytes ÷ 4 (script heuristic). Matches ticket order of magnitude (~40k worst-case **full** corpus; S0 alone was ~10k on cache-components).

---

## Total guidance corpus (all tiers)

Full shipped guidance (S0–S3 + skills). Smaller because duplication removed; depth moved to S2 on demand — **not deleted**.

| Template | Total before | Total after | Δ % | Budget check |
|----------|--------------|-------------|-----|--------------|
| `nextjs` | 81.7 KB | **40.4 KB** | −51% | ✅ |
| `nextjs-app-router` | 92.2 KB | **44.7 KB** | −52% | ✅ |
| `nextjs-app-router-cache-components` | 137.4 KB | **57.6 KB** | −58% | ✅ |
| `monorepo-root` | 43.9 KB | **38.2 KB** | −13%* | ✅ |

\*Monorepo total grew slightly vs mid-PR because full rule depth was **preserved** in `.agents/docs/` (quality-first). S0 still dropped 62%.

---

## Tier breakdown (after) — cache-components (worst template)

| Tier | Size | When loaded | ~Tokens |
|------|------|-------------|---------|
| **S0** default | 12.0 KB | Every session | ~3,100 |
| **S1** index | 3.0 KB | Task routing | ~760 |
| **S2** depth | 29.3 KB | On demand | ~7,500 |
| **S3** tool pointers | 2.0 KB | Per IDE | ~500 |
| **skills** (15 cards) | 11.4 KB | One per task | ~2,900 |

**Before:** S0 alone was **38.3 KB** — larger than today's **entire S0+S1** stack.

---

## Scaffold proof (what users actually get)

`create-content-sdk-app` scaffold test (after `npm run build` in package):

| Template | `AGENTS.md` in generated app | Before (monolithic `dev`) |
|----------|---------------------------|---------------------------|
| `nextjs` | **7.4 KB** | ~17.5 KB |
| `nextjs-app-router` | **8.8 KB** | ~20.5 KB |
| `nextjs-app-router-cache-components` | **10.4 KB** | ~31.8 KB |

Also verified: `.agents/docs/` ships, 1× `alwaysApply` rule, thin `copilot-instructions.md` / `.windsurfrules` (< 3 KB each).

---

## Ticket scenario mapping

| Scenario | Before (approx.) | After (approx.) |
|----------|------------------|-----------------|
| Open starter in Cursor, guidance only | ~35k tok (full corpus auto-loaded) | **~3k tok** (S0 only) |
| Agent follows old `CLAUDE.md` (“load everything”) | ~35k tok | **~15k tok** (full corpus still available, not default) |
| Agent follows new `CLAUDE.md` (S0 + one skill) | N/A | **~3.3k tok** |

---

## Validation (automated)

```bash
cd packages/create-content-sdk-app && npm run build
npx tsx ./scripts/llm-context/validate-llm-context.ts
```

| Gate | Result |
|------|--------|
| `measure-llm-context:check` | ✅ all targets |
| Scaffold test (3 templates) | ✅ slim corpus ships |
| Regression matrix (18 scenarios) | ✅ guidance patterns present |

---

## Screenshot

Open in browser for a visual summary:

**`docs/investigations/JSS-9247-pr-evidence.html`**

---

## Reproduce locally

```bash
# Metrics report
npx tsx ./scripts/llm-context/measure-llm-context.ts

# JSON for tooling
npx tsx ./scripts/llm-context/measure-llm-context.ts --json

# Full validation (build templates first)
cd packages/create-content-sdk-app && npm run build && cd ../..
npx tsx ./scripts/llm-context/validate-llm-context.ts
```

---

## Related docs

- [JSS-9247-llm-context-baseline.md](JSS-9247-llm-context-baseline.md) — plan & phased metrics  
- [JSS-9247-accuracy-pass.md](JSS-9247-accuracy-pass.md) — quality vs source  
- [JSS-9247-validation-results.md](JSS-9247-validation-results.md) — gate details
