# Plugins and adapters

Official: [Plugins](https://doc.sitecore.com/sai/en/developers/content-sdk/20/plugins.html) · [Adapters](https://doc.sitecore.com/sai/en/developers/content-sdk/20/adapters.html). Raw: `llm-wiki/raw/2026-05-14-plugins.md`, `2026-05-14-adapters.md`.

## Plugins

- Declarative, typed extensions with **`name`**, **`options`**, **`dependencies`**, **`init`**, optional **`adapter`**.
- Typical entry: **`initContentSdk`** (see templates / `packages/nextjs` init patterns).

## Built-in stack (per doc)

| Plugin | Role | Package |
|--------|------|---------|
| `analyticsPlugin` | Client ID + shared analytics init; base for events/personalize | `@sitecore-content-sdk/analytics-core` |
| `eventsPlugin` | Page view / custom events | `@sitecore-content-sdk/events` |
| `personalizeBrowserPlugin` / `personalizeServerPlugin` | Personalization | `@sitecore-content-sdk/personalize` |

Further reading: [Initializing tracking, events, and personalization](https://doc.sitecore.com/sai/en/developers/content-sdk/20/initializing-tracking,-events,-and-personalization-in-the-content-sdk.html).

## Adapters

Environment-specific implementations for plugins (browser vs server: cookies, headers, location). Analytics adapters extend **`PluginAdapter`** / **`AnalyticsAdapter`** from **`@sitecore-content-sdk/core`**.

## Related

- [doc-sitecore-config.md](doc-sitecore-config.md) — personalize block
