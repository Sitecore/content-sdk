# Content SDK LLM Wiki

Persistent markdown knowledge base for **Content SDK monorepo** development, maintained by an LLM per the [LLM Wiki pattern](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f).

| Layer | Path | Role |
|--------|------|------|
| **Schema** | [AGENTS.md](../AGENTS.md) (section *LLM Wiki*) | Conventions, workflows, truth hierarchy |
| **Wiki** | [`wiki/`](wiki/) | LLM-written synthesis, entities, flows (git-tracked) |
| **Plans (in progress)** | [`wiki/plans/`](wiki/plans/) | In-flight feature and wiki-change plans; not canonical until merged into `wiki/**` |
| **Raw sources** | [`raw/`](raw/) | Immutable inputs (clipped docs, exports you add) |

Start with [`wiki/index.md`](wiki/index.md) and [`wiki/log.md`](wiki/log.md). Next.js head docs live under [`wiki/content-sdk-nextjs/`](wiki/content-sdk-nextjs/). In-progress plans live under [`wiki/plans/`](wiki/plans/). Do not edit files under `raw/` except by adding new source material.

**Platform naming:** See [`wiki/common/doc-terminology-platform-names.md`](wiki/common/doc-terminology-platform-names.md).
