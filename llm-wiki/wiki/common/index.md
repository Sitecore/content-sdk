# Common wiki (shared packages)

Framework-agnostic Content SDK knowledge: **`packages/core`**, **`packages/content`** (`SitecoreClient`, `defineConfig`, layout GraphQL, editing helpers when described without a specific head), **`packages/cli`**, and **cross-head env / config contracts**.

## Pages (canonical for all heads)

| Page | Summary |
|------|---------|
| [doc-sitecore-config-input.md](doc-sitecore-config-input.md) | **`SitecoreConfigInput`** / **`SitecoreConfig`**, merge pipeline, CLI config, head wrappers |
| [doc-config-environment-variables.md](doc-config-environment-variables.md) | **`buildFallbackConfig`** exact env keys; **`SITECORE_*` / `NEXT_PUBLIC_*` / `CSDK_PUBLIC_*`** (Angular-only) |
| [doc-sitecore-client-and-graphql.md](doc-sitecore-client-and-graphql.md) | **`createGraphQLClientFactory`**, Edge/local URLs, **`SitecoreClient`** methods |
| [doc-component-map.md](doc-component-map.md) | Component map format, `GenerateMapArgs`, type names, head-specific wiring |
| [doc-terminology-platform-names.md](doc-terminology-platform-names.md) | **Sitecore AI**, **SitecoreAI**, **SAI**, **XM Cloud**, **Sitecore XM Cloud**, **XMC** — same platform naming in docs and comments |
| [wiki-boundary-and-token-audit.md](../wiki-boundary-and-token-audit.md) | Next vs Angular vs **common** boundaries, LLM routing, vague-language checklist |

## Head wikis

| Stack | Index |
|-------|--------|
| Next.js | [../content-sdk-nextjs/index.md](../content-sdk-nextjs/index.md) — middleware, `SitecoreNextjsClient`, templates |
| Angular | [../content-sdk-angular/index.md](../content-sdk-angular/index.md) — loaders, SSR, `environment*.ts` |

When a topic is duplicated between a head wiki and **common**, treat **common** as canonical for **`@sitecore-content-sdk/content`** behavior; head pages keep integration-only deltas.
