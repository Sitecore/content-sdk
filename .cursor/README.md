# Cursor Rules for Sitecore Content SDK

This directory contains AI coding agent guidance files to help maintain consistent code quality and follow Sitecore best practices across the Content SDK repository.

## Rules Overview

### Core Rules (Always Applied)
- **`general.mdc`** - Universal coding principles and architecture patterns
- **`code-style.mdc`** - Vibe-coding principles, TypeScript standards, and quality guidelines
- **`safety.mdc`** - Safety rules to prevent editing compiled artifacts
- **`project-context.mdc`** - Project-specific context and constraints
- **`repo-structure.mdc`** - Repository layout and template policies

### Scoped Rules (Applied to Specific Files)
- **`javascript.mdc`** - JavaScript/TypeScript naming conventions, performance, JSDoc standards
- **`sitecore.mdc`** - Sitecore XM Cloud development patterns and component guidelines
- **`testing.mdc`** - Test strategy with Mocha/Sinon/Chai and NYC coverage
- **`cli.mdc`** - CLI behavior and initialization flow patterns

## Usage

When using AI coding assistants like Cursor:
1. Rules automatically provide context based on the files you're working with
2. Follow the naming conventions and architectural guidance provided
3. Refer to specific rules when uncertain about implementation approaches
4. Generated projects inherit these rules automatically when using Cursor

## Contributing

To improve these rules:
1. Edit the relevant `.mdc` files in this directory
2. Keep rules under 500 lines and focused on specific concerns
3. Include concrete examples and file references using `@filepath` syntax
4. Test changes with AI coding assistants to ensure effectiveness

For more details, see the [Contributing Guide](../CONTRIBUTING.md#ai-assisted-development).
