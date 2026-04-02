---
name: content-sdk-upgrade-assistant
description: Guides upgrading @sitecore-content-sdk/* packages: version bumps, breaking changes, migration steps. Use when moving to a newer SDK or package version. Check Content SDK repo CHANGELOG and upgrade guides.
---

# Upgrade SDK packages (Pages Router)

**Detail:** [AGENTS-overview.md](../../docs/AGENTS-overview.md#project-overview); doc site migration docs; Content SDK repo CHANGELOG.

## When

- Bumping `@sitecore-content-sdk/*` or applying a migration.

## Rules

- Keep all `@sitecore-content-sdk/*` on compatible versions; run `npm install` + `npm run build`; re-test editing/preview.
- Apply breaking-change steps from the upstream CHANGELOG before shipping.

## Stop

- If target version or required infra (new env vars) is unclear, ask before editing lockfiles or CI.

Docs: [Content SDK CHANGELOG](https://github.com/Sitecore/content-sdk/blob/dev/CHANGELOG.md) · [Product docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
