# Example environment variable files

From [Example environment variable files](https://doc.sitecore.com/sai/en/developers/content-sdk/20/example-environment-variable-files.html). Raw: `llm-wiki/raw/2026-05-14-example-environment-variable-files.md`.

## Product intent

- **`.env.*.example`** files document two **lifecycle**-oriented setups: **container** (local stack) vs **remote** (hosted Sitecore AI / Edge).
- Copy into **`.env.local`** for real values; never commit secrets into **`.example`** files.

## Where they live in this monorepo

### CLI templates (source only)

Templates under **`packages/create-content-sdk-app/src/templates/`** are **scaffolding sources** for `create-content-sdk-app`. They include committed **`.env.*.example`** files so generated apps get the right shape—but the **template folders themselves are not runnable apps** (no in-repo install/dev workflow as a full application).

| Head / router | Template path | Example env files (in repo) |
|-----------------|---------------|------------------------------|
| **Next.js — Pages Router** | `packages/create-content-sdk-app/src/templates/nextjs/` | `.env.container.example`, `.env.remote.example` |
| **Next.js — App Router** | `packages/create-content-sdk-app/src/templates/nextjs-app-router/` | `.env.container.example`, `.env.remote.example` |

| Template file | When to use |
|---------------|-------------|
| `.env.container.example` | **Local development** against **Docker / local** Sitecore (or equivalent local images): local GraphQL, `NEXT_PUBLIC_SITECORE_API_HOST`, `NEXT_PUBLIC_SITECORE_API_KEY`, editing + default site/language. |
| `.env.remote.example` | **Remote / hosted Sitecore AI** — **Experience Edge** and IDs for a cloud tenant; variables such as `SITECORE_EDGE_CONTEXT_ID`, `NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID`, optional `NEXT_PUBLIC_SITECORE_EDGE_PLATFORM_HOSTNAME`, Personalize timeouts/scope, optional Design Library auth. Tuned for **authoring and editing** against a remote instance; you can still run the app in dev against remote, but that path is oriented to **Pages / editor** workflows rather than “pure local stack” day one. |

### Container vs remote (lifecycle)

- **Container** — You run **local** Sitecore (commonly **Docker** images) while building the head. GraphQL and keys target that **on-machine** stack; this is the usual **inner-loop development** story.
- **Remote** — The head talks to a **remote Sitecore AI** tenant: **Experience Edge** hostname, **`SITECORE_EDGE_CONTEXT_ID`**, **`NEXT_PUBLIC_SITECORE_EDGE_CONTEXT_ID`**, and related keys as listed in **`.env.remote.example`** for your template. That flow is **mainly for editing and authoring** in the cloud product, not for replacing local Docker—but **development can continue** against a remote instance when you intentionally point `.env.local` at that tenant (for example a shared dev environment or editor smoke tests).

**Pages vs App Router:** both Next templates ship **`.env.container.example`** and **`.env.remote.example`** under the same **container vs remote** idea; individual variable names can differ—always copy from the **template** (or generated app) you actually use.

### Scaffolded samples (local dev, diagnostics)

For **local testing, diagnostics, and anything that needs a working app** (install, dev server, real `.env.local`), use **`samples/`**, not the template tree.

1. From the **monorepo root**, run **`yarn scaffold-samples`**. That runs **`scripts/scaffold-samples.js`**, which reads **`scripts/samples.json`** and, for each entry, calls **`initialize`** from **`packages/create-content-sdk-app`** with **`destination`** set to **`./samples/<folder>/`** (folder name from **`scripts/utils.js`** **`getAppFolder`**, e.g. **`sample-nextjs-SSG`** when `template` is **`nextjs`** and **`prerender`** is **`SSG`**).
2. The scaffold **copies/transforms** the chosen template into that **`samples/<folder>/`** app. That app is a **normal generated head**: copy **`.env.container.example`** or **`.env.remote.example`** to **`.env.local`**, install deps, run **`dev`** / **`start`**, use **`yarn lint-samples`** for CI-style lint of scaffolded apps.
3. **`samples/`** is listed in **`.gitignore`**—it is **not** checked in. Each developer (or CI job) regenerates samples when needed.

**Summary:** **Templates** = canonical **examples** and CLI input. **`samples/*`** = disposable **runnable** copies for monorepo local dev; put env files and runtime diagnostics there.

### Template watch mode (`yarn watch`)

For **template authors** iterating on files under `src/templates/`: detects changes with **chokidar** and re-scaffolds the destination sample automatically.

**Prerequisite:** Create **`watch.json`** in `packages/create-content-sdk-app/` (gitignored at package level):

```json
{
  "template": "<template-name>",
  "args": {
    "yes": true,
    "force": true,
    "silent": false,
    "appName": "<app-name>",
    "destination": "..\\..\\samples\\<folder>",
    "prerender": "SSG"
  }
}
```

| Field | Notes |
|-------|-------|
| `template` | `"nextjs"`, `"nextjs-app-router"`, or `"angular"` |
| `args.destination` | Relative to `packages/create-content-sdk-app/`; typically `"../../samples/<folder>"` |
| `args.force` | Must be `true` — overwrites destination on every re-scaffold |
| `args.prerender` | `"SSG"` or `"SSR"` |

**Run:** from `packages/create-content-sdk-app/`, run **`yarn watch`** (`ts-node ./scripts/watch-templates.ts`).

**Lifecycle:**

1. **Startup (`ready`):** scaffolds the sample once with a full `yarn install` in the destination.
2. **On any `src/templates/` file change:** re-scaffolds with `noInstall: true` — skips `yarn install` to keep the loop fast.
3. **After each scaffold:** `restoreLockfile` checks `git status`; if `yarn.lock` was modified, it runs `git restore ../../yarn.lock` so the sample's install changes do not pollute the monorepo lock file.

**Env files in the sample:** copy `.env.container.example` or `.env.remote.example` to `.env.local` inside `samples/<folder>/` after the first scaffold. Re-scaffolds overwrite app source files but not `.env.local` (it is not a template file).

**Script:** `packages/create-content-sdk-app/scripts/watch-templates.ts`

## Relationship to `sitecore.config.ts`

`defineConfig` / **`buildFallbackConfig`** read the same logical settings from **`process.env`** (and Next’s **`getNextFallbackConfig`** layers **`NEXT_PUBLIC_*`**). Keeping **`.env.local`** and **`sitecore.config.ts`** in sync (especially **`NEXT_PUBLIC_DEFAULT_LANGUAGE`** ↔ **`defaultLanguage`**, site name, Edge IDs) avoids subtle mismatches. See [doc-sitecore-config.md](doc-sitecore-config.md). For another head in this monorepo, open the **[Angular wiki index](../content-sdk-angular/index.md)** (public env uses **`CSDK_PUBLIC_*`** and **`generate-environment.ts`**).

## Related

- [doc-sitecore-config.md](doc-sitecore-config.md)
- [../common/doc-config-environment-variables.md](../common/doc-config-environment-variables.md)
- [doc-i18n-multilingual.md](doc-i18n-multilingual.md) — `NEXT_PUBLIC_DEFAULT_LANGUAGE` and Next `i18n.defaultLocale`
- [doc-editor-integration-metadata.md](doc-editor-integration-metadata.md) — **`JSS_ALLOWED_ORIGINS`** for editing CORS
