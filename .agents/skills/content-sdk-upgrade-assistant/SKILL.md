---
name: content-sdk-upgrade-assistant
description: Guides upgrading the SDK: version bumps, breaking changes, and migration steps. Use when moving to a newer SDK or package version.
---

# Content SDK Upgrade Assistant

Upgrade packages and templates safely; follow changelog and migration guides.

## When to Use

- User asks to upgrade SDK packages, update to a new version, or apply a migration.
- Task involves version bumps, @sitecore-content-sdk/* dependencies, or breaking changes.
- User mentions "upgrade," "migration," "new version," or "breaking change."

## Hard Rules

- Prefer upgrading all @sitecore-content-sdk/* packages together to a consistent set of versions unless the user requests a partial upgrade. Check peer dependencies and compatibility.
- In monorepo: update package.json in each package and in templates (create-content-sdk-app); run yarn install and yarn build; run tests (yarn test-packages) and api-extractor if public API changed.
- In head apps: update dependencies in package.json; run npm install and npm run build; test editing and preview. Do not edit dist/ or lockfiles unless required for the upgrade.
- Read CHANGELOG.md (and any MIGRATION.md or upgrade guide in the repo or docs) for breaking changes and required code/config updates. Apply migration steps before or with the version bump.
- After template changes in monorepo: verify with yarn scaffold-samples or yarn watch and npm install && npm run build in a generated sample.

## Stop Conditions

- Stop if the target version is not specified or unclear; ask or suggest checking CHANGELOG and supported versions.
- Stop if a breaking change requires product or deployment decisions (e.g. new env vars, config schema); list required changes and ask the user to confirm.
- Do not upgrade CI, Node version, or root tooling unless the task explicitly includes it.

## References

- [CHANGELOG.md](../../../CHANGELOG.md) and repo MIGRATION/upgrade docs.
- [AGENTS.md](../../../AGENTS.md) for build and test commands; CONTRIBUTING.md for workflow.
- [Official Content SDK docs](https://doc.sitecore.com/xmc/en/developers/content-sdk/sitecore-content-sdk-for-xm-cloud.html).
