 # Skills.md — Capability groupings for the Sitecore Content SDK

This file describes the Content SDK ecosystem in terms of **capability-style groupings**: high-level areas that help AI tools and developers map tasks to the right part of the SDK. There is no formal API, schema, or folder structure — just a conceptual map. For concrete steps and patterns, see AGENTS.md (monorepo or app) and the [official Content SDK documentation](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).

---

## Why capability grouping

Grouping related capabilities (components, data fetching, editing, i18n, etc.) makes it easier for AI assistants and developers to know which area of the SDK applies to a given task, to give consistent suggestions, and to point to the right docs and patterns. When generating code or answering questions about the Content SDK, map the task to one or more of the groupings below; use AGENTS.md and the official docs for concrete steps.

---

## Capability groupings

### content-sdk-component-scaffold

Creating new Sitecore components: file structure, props interface, and placement under `src/components/`. Use when adding a new component from scratch.

### content-sdk-component-registration

Registering components in the component map (e.g. `.sitecore/component-map.ts`, `.sitecore/component-map.client.ts` for App Router). Required so the layout and editing pipeline can resolve and render components. App Router has separate server and client maps; Pages Router uses a single map.

### content-sdk-editing-safe-rendering

Safe rendering in XM Cloud editing and preview: draft mode, editing chromes, and design library. Use when ensuring components behave correctly in the Sitecore editor and preview.

### content-sdk-field-usage-image-link-text

Using SDK field components for content: `<Text>`, `<RichText>`, `<Image>`, `<Link>`, and related helpers. Use when rendering Sitecore fields with proper validation and fallbacks.

### content-sdk-graphql-data-fetching

GraphQL-based data fetching: Layout Service, page and dictionary fetching, and related client usage. Use when fetching page data, layout, or dictionary phrases. All fetching goes through a single client instance (e.g. `src/lib/sitecore-client.ts` in apps).

### content-sdk-route-and-layout

Routing (catch-all route, `[site]`/`[locale]` segments) and layout (root layout, placeholders, `Layout.tsx`). Use when changing how pages are routed or how placeholders are rendered. App Router uses `app/[site]/[locale]/[[...path]]/page.tsx`; Pages Router uses `pages/[[...path]].tsx` and middleware for site resolution.

### content-sdk-site-setup-and-env

Site and environment setup: `sitecore.config.ts`, environment variables, default site and language. Use when configuring the app for a site or environment. Document required vars in `.env.example` only; never commit `.env` or `.env.local`.

### content-sdk-multisite-basics

Multisite: site resolution, `.sitecore/sites.json`, and middleware/proxy behavior for resolving site from request. Use when working with multiple sites or hostnames.

### content-sdk-dictionary-and-i18n

Dictionary and internationalization: dictionary fetching, next-intl (App Router) or Next.js i18n (Pages Router), and locale handling. Use when adding or changing translated content or locale behavior. App Router uses request locale (e.g. `site_locale`); Pages Router uses locale from context in getStaticProps/getServerSideProps.

### content-sdk-sitemap-robots

Sitemap and robots.txt: sitemap and robots route handlers and rewrites. Use when configuring SEO or sitemap/robots behavior.

### content-sdk-component-variants

Component variants: different renderings or variants of the same component type. Use when a single component definition has multiple presentations or data-driven variants.

### content-sdk-troubleshoot-editing

Troubleshooting XM Cloud editing, preview, and design library: common issues, headers, and debugging. Use when editing or preview does not behave as expected.

### content-sdk-upgrade-assistant

Upgrading the SDK: version bumps, breaking changes, and migration steps. Use when moving to a newer SDK or package version.

### content-sdk-component-data-strategy

Component data strategy: fetching and passing component data, BYOC (Bring Your Own Component), and server/client component props. Use when wiring component-specific data or integrating custom components.

---

## Example layout (placeholder)

A capability grouping is described by a **name** and a **short description** of what it covers and when it applies. For example:

**content-sdk-example-capability** — Short description of the capability area and when an AI or developer should consider it (e.g. “Use when doing X or Y”). No code or schema; the rest of the SDK and AGENTS.md provide the concrete steps.

---

## How to use this

When generating code or answering questions about the Content SDK, map the task to one or more of the groupings above. Use [AGENTS.md](AGENTS.md) for project- and app-level instructions (commands, structure, DO/DON'T) and the [official documentation](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html) for detailed APIs and guides.
