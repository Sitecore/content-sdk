# Code style

Full detail for tasks touching TypeScript sources, imports, or lint. Cursor: [`.cursor/rules/code-style.mdc`](../../.cursor/rules/code-style.mdc).

## Vibe-coding principles

**Core philosophy:**

- Write clean, modular, and idiomatic code
- Prefer declarative over imperative patterns
- Make code readable and self-documenting
- TypeScript-first development approach

**Code organization:**

- Use Node LTS
- Export public types at module boundaries
- Prefer pure functions and thin wrappers
- No top-level side effects (except CLI entry)
- Modular architecture with clear separation of concerns

## Code quality standards

**TypeScript:**

- Enable strict mode in all projects
- Prefer explicit types over `any`
- Use discriminated unions for complex state
- Export types at module boundaries for reusability

**Functional programming:**

- Prefer pure functions where possible
- Use immutable data patterns
- Avoid side effects in business logic
- Compose small, focused functions

**Readability:**

- Use descriptive variable and function names
- Keep functions small and focused (single responsibility)
- Add comments for complex business logic only
- Prefer self-documenting code over extensive comments

## Error handling

- Fail fast with clear, actionable messages
- Propagate child-process errors with context
- Use custom error classes for domain-specific errors
- Handle edge cases explicitly with guard clauses

Security: see [RULES-safety.md](RULES-safety.md).

## Development workflow

**Logging:**

- Clear phases and results
- Support silent flag if available
- Use appropriate log levels (debug, info, warn, error)
- Include context in error messages

**Imports:**

- Relative for local modules
- Never import from `dist/`
- Group imports logically (external, internal, relative)
- Use barrel exports (`index.ts`) for clean APIs

**Lint and format:**

- Keep ESLint + Prettier passing at all times
- Follow configured style rules consistently
- Use automated formatting on save
- Address linting warnings promptly
