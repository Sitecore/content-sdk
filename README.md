# Sitecore Content SDK

[![Publish](https://github.com/Sitecore/content-sdk/actions/workflows/publish.yml/badge.svg)](https://github.com/Sitecore/content-sdk/actions/workflows/publish.yml) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

This repository contains source code for all Sitecore Content SDK packages and templates to help you get started using Sitecore Content SDK.

<!--
@TODO: adjust for new versioning
-->

## Getting started with Sitecore Content SDK

To develop a Sitecore Content SDK application, you need:

- An operating system supported by Node (Mac, Windows, Linux).
- Node. We recommend using the latest long-term support (LTS) release.

> To run a Sitecore Content SDK application in production or develop using Sitecore data you need to connect your application to a Sitecore XM Cloud instance.

### Getting started with the latest version of Sitecore Content SDK

To create a Sitecore Content SDK project in a terminal, run one of the following command and follow the prompts:

```
npx create-content-sdk-app
```

For more information check out our [Getting Started Guide](https://doc.sitecore.com/sai/en/developers/content-sdk/20/sitecore-content-sdk-for-sitecoreai.html).

## Documentation and community resources

- Official documentation:
- [Content SDK](https://doc.sitecore.com/sai/en/developers/content-sdk/sitecore-content-sdk-for-sitecoreai.html)
- [StackExchange](https://sitecore.stackexchange.com/)
- [Community Slack](https://sitecorechat.slack.com/messages/content-sdk)
- [Sitecore Community Forum](https://community.sitecore.net/developers/f/40)

### AI Development Support

- [AGENTS.md](AGENTS.md) - AI agent guidance: structure, commands, DOs/DON'Ts, boundaries, quick reference, and **LLM Wiki** maintainer rules for `llm-wiki/`
- [LLM Wiki](llm-wiki/README.md) - persistent markdown knowledge base (raw sources + agent-maintained wiki); schema and workflows in the **LLM Wiki** section of [AGENTS.md](AGENTS.md)
- [Skills.md](Skills.md) - Capability groupings for the Content SDK (for AI tools and developers); [.agents/skills/](.agents/skills/) provides each capability as an Agent Skill (SKILL.md) for tools that support the [Agent Skills](https://agentskills.io) standard
- [Claude Code Agent Guide](CLAUDE.md) - Comprehensive guide for Claude Code Agent to generate consistent and idiomatic Sitecore Content SDK code
- [GitHub Copilot Instructions](copilot-instructions.md) - Instructions for GitHub Copilot to provide accurate Sitecore Content SDK suggestions
- [Cursor AI Rules](.cursor/rules/) - Cursor-specific coding rules and patterns for Sitecore Content SDK development
- [Windsurf AI Rules](.windsurfrules) - Windsurf IDE configuration for Sitecore Content SDK development
- [Skills & capability index](Skills.md) - Capability groupings and Agent Skills (`.agents/skills/`); for overview and commands use [AGENTS.md](AGENTS.md)

**Which AGENTS.md to use:** The root [AGENTS.md](AGENTS.md) applies when working in **this monorepo** (packages, yarn, scaffolding). For head applications (including empty starters) generated from our templates, use the AGENTS.md that ships with the head application — it is copied from the template when you run `create-content-sdk-app` and you can adapt it to your project as needed.

## Contributions

We are very grateful to the community for contributing bug fixes and improvements. We welcome all efforts to evolve and improve the Sitecore Content SDK; read below to learn how to participate in those efforts.

### [Code of Conduct](CODE_OF_CONDUCT.md)

Sitecore has adopted a Code of Conduct that we expect project participants to adhere to. Please read [the full text](CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](CONTRIBUTING.md)

Read our [contributing guide](CONTRIBUTING.md) to learn about our development process, how to propose bug fixes and improvements, and how to build and test your changes to React.

### License

Sitecore JavaScript Content SDK is using the [Apache 2.0 license](LICENSE.MD).

## [Support](SUPPORT.md)
