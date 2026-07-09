# Workflows, testing, and CLI

Example agent tasks and package workflows. Cursor: [`.cursor/rules/agent-tasks.mdc`](../../.cursor/rules/agent-tasks.mdc), [`.cursor/rules/cli.mdc`](../../.cursor/rules/cli.mdc), [`.cursor/rules/testing.mdc`](../../.cursor/rules/testing.mdc).

## Example agent tasks

### 1. Add a utility in a package

Example: Add a constant in `packages/core/src/constants.ts`:

- Export from `packages/core/src/index.ts` if public
- Add JSDoc: `@internal` for internal APIs; `@public` and full `@param`/`@returns` for public APIs
- Add tests in `packages/core/src/constants.test.ts` (if needed)
- Run `yarn api-extractor` if you change public exports

### 2. Fix a failing test

```bash
yarn test-packages
# Or: cd packages/content && yarn test
```

- Locate the failing `*.test.ts` file
- Preserve intended behavior; fix assertions or implementation
- Re-run tests before completing

### 3. Change a scaffolding template

- Edit under `packages/create-content-sdk-app/src/templates/nextjs/`, `nextjs-app-router/`, or `nextjs-app-router-cache-components/`
- Use `.env.*.example` for env vars (never `.env`)
- Verify: Run `yarn watch` (with `watch.json`) or `yarn scaffold-samples`, then `npm install && npm run build` in the generated sample

## Testing

- Mocha with `ts-node/register`
- Nearby `*.test.ts` with success + failure cases
- Stub child-process and `fs` as needed

**Commands:**

- Package level: `yarn test`, `yarn coverage`
- Monorepo level: `yarn test-packages`, `yarn coverage-packages`
- API surface: `yarn api-extractor:verify` when changing public exports (see `CONTRIBUTING.md`)

## CLI (create-content-sdk-app)

- Drive init via `Initializer.init(args)`
- Clear prompts and defaults
- Install dependencies after scaffolding
- Print next steps

**Non-goals:** No deployments or CI flows; no global user state changes.

**Backwards compatibility:** Avoid breaking arg names; additive changes with defaults.

## Boundaries (monorepo)

**Never edit:** `dist/**`, `.next/`, `out/`, `build/`, `node_modules/`. Do not modify `yarn.lock` or `package-lock.json` unless explicitly required.

**Never edit without explicit instruction:**

- `.github/workflows/` — CI configuration
- Root tooling (scripts, lerna config) — unless tasked

**Focus on:**

- `src/**` in packages
- `packages/create-content-sdk-app/src/templates/**`
- `*.test.ts`, `*.spec.ts`

**Environment variables:** Document in `.env.example` (or template `.env.*.example`) with placeholders only. Never commit `.env` or `.env.local`. See [RULES-safety.md](RULES-safety.md).
