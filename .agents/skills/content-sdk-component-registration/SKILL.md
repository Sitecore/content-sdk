---
name: content-sdk-component-registration
description: Registers Sitecore components in the component map so layout and editing can resolve and render them. Use when registering a new component, updating component-map, or when layout or editor cannot find a component. App Router uses component-map.ts and component-map.client.ts; Pages Router uses a single component-map.
---

# Content SDK Component Registration

Register components in the Sitecore component map so the layout and editing pipeline can resolve and render them.

## When to Use

- After scaffolding or adding a new Sitecore component (must be registered).
- User reports a component not rendering, "component not found," or layout/placeholder showing raw component name.
- Task involves component-map, `.sitecore/component-map.ts`, or `.sitecore/component-map.client.ts`.
- User asks how to register a component or fix component resolution.

## Hard Rules

- Every component rendered from Sitecore layout must be registered in the component map. Keep the map in sync with `src/components/`.
- **App Router:** Register in both `.sitecore/component-map.ts` (Server) and `.sitecore/component-map.client.ts` (Client). Server components go in component-map.ts; Client components in component-map.client.ts.
- **Pages Router:** Register in `.sitecore/component-map.ts` only. Used by getComponentData and editing API routes.
- Use consistent component names (e.g. same key in map as used in layout). Follow existing naming in the map.
- Do not remove or rename registrations without updating all references (layout, tests, docs).

## Stop Conditions

- Stop if the app has both server and client component maps and it is unclear whether the new component is Server or Client; ask or follow app convention.
- Stop if modifying the component map would break existing layout or editing; suggest a safe change or ask for confirmation.
- Do not edit `.sitecore/metadata.json` or import-map unless the task explicitly requires it; prefer component-map only for registration.

## References

- [AGENTS.md](../../../AGENTS.md) (monorepo or app) for structure and which package/app to edit.
- Template AGENTS.md (nextjs-app-router or nextjs) for App vs Pages Router component map locations.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
