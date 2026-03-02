---
name: content-sdk-upgrade-assistant
description: Guides upgrading @sitecore-content-sdk/* packages: version bumps, breaking changes, migration steps. Use when moving to a newer SDK or package version. Check Content SDK repo CHANGELOG and upgrade guides.
---

# Content SDK Upgrade Assistant (Pages Router)

Upgrade @sitecore-content-sdk/* packages safely; follow the Content SDK repo changelog and migration guides.

## When to Use

- User asks to upgrade SDK packages, update to a new version, or apply a migration.
- Task involves version bumps, @sitecore-content-sdk/* dependencies, or breaking changes.
- User mentions "upgrade," "migration," "new version," or "breaking change."

## How to perform

- Bump all @sitecore-content-sdk/* to consistent versions; read the Content SDK repo CHANGELOG (and MIGRATION/upgrade docs) for breaking changes and migration steps. Update package.json, run `npm install` and `npm run build`; test editing and preview after upgrade.

## Hard Rules

- Prefer upgrading all @sitecore-content-sdk/* packages together to a consistent set of versions unless the user requests a partial upgrade. Check peer dependencies and compatibility.
- Update dependencies in package.json; run `npm install` and `npm run build`. Test editing and preview after upgrade.
- Read the **Content SDK repository** CHANGELOG (and any MIGRATION.md or upgrade guide) for breaking changes and required code/config updates. Apply migration steps before or with the version bump.
- Do not edit .next/, node_modules/, or lockfiles unless required for the upgrade. Do not change CI or root tooling unless the task explicitly includes it.

## Stop Conditions

- Stop if the target version is not specified or unclear; ask or suggest checking the Content SDK CHANGELOG and supported versions.
- Stop if a breaking change requires product or deployment decisions (e.g. new env vars, config schema); list required changes and ask the user to confirm.

## References

- Content SDK repo [CHANGELOG](https://github.com/Sitecore/content-sdk/blob/dev/CHANGELOG.md) and upgrade docs.
- [AGENTS.md](../../../AGENTS.md) for build commands.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
