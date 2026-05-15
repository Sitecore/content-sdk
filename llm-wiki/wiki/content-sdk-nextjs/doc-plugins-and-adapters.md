# Plugins and adapters (Next.js)

**Scope: Next.js head only.** The Angular head does not use this plugin system. For Angular bootstrap, start at the **[Angular wiki index](../content-sdk-angular/index.md)**.

Official: [Plugins](https://doc.sitecore.com/sai/en/developers/content-sdk/20/plugins.html) · [Adapters](https://doc.sitecore.com/sai/en/developers/content-sdk/20/adapters.html). Raw: `llm-wiki/raw/2026-05-14-plugins.md`, `2026-05-14-adapters.md`.

## Initialization (`initContentSdk`)

**`initContentSdk`** (`packages/core/src/initialization/init-content-sdk.ts`) is called from **`Bootstrap.tsx`** in Next.js templates. It:

1. Resolves core context from `{ contextId, edgeUrl, siteName }`.
2. Registers all supplied plugins into an internal map keyed by plugin name.
3. Calls each plugin's `init()` function (if present) asynchronously and awaits completion.

Called from: `packages/create-content-sdk-app/src/templates/nextjs/src/Bootstrap.tsx`.

## Plugins

Declarative typed extensions with `name`, `options`, `dependencies`, optional `init`, and optional `adapter`.

## Built-in stack

| Plugin | Role | Package |
|--------|------|---------|
| `analyticsPlugin` | Client ID + shared analytics init; base for events/personalize | `@sitecore-content-sdk/analytics-core` |
| `eventsPlugin` | Page view / custom events | `@sitecore-content-sdk/events` |
| `personalizeBrowserPlugin` / `personalizeServerPlugin` | Personalization | `@sitecore-content-sdk/personalize` |

## Adapters

Environment-specific implementations for plugins (browser vs server: cookies, headers, location). Analytics adapters extend **`PluginAdapter`** / **`AnalyticsAdapter`** from **`@sitecore-content-sdk/core`**.

## Related

- [doc-sitecore-config.md](doc-sitecore-config.md) — personalize block
