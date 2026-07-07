# General coding principles

Architecture and quality standards for SDK work. Cursor: [`.cursor/rules/general.mdc`](../../.cursor/rules/general.mdc).

## Universal standards

- DRY Principle
- SOLID Principles
- Write self-documenting code with clear intent
- Use meaningful names that express business concepts
- Prefer explicit over implicit behavior
- Make dependencies and requirements obvious

## Architecture patterns

**Modular design:**

- Organize code into focused, cohesive modules
- Minimize coupling between modules
- Use clear interfaces between layers
- Follow established patterns consistently

**Data flow:**

- Prefer unidirectional data flow
- Validate inputs at system boundaries
- Transform data at appropriate layers
- Handle errors close to their source

**Testing:**

- Write testable code with minimal dependencies
- Use dependency injection for better testability
- Mock external services and side effects
- Test behavior, not implementation details

## Development standards

**Version control:**

- Write descriptive commit messages
- Keep commits focused and atomic
- Use branching strategies appropriate to team size
- Review code before merging

**Documentation:**

- Document public APIs and interfaces with tsdoc comments
- Include usage examples for complex functionality
- Keep documentation close to code
- Update documentation with code changes

**Performance:**

- Optimize for readability first, performance second
- Profile before optimizing
- Cache expensive operations appropriately
- Consider memory usage and cleanup

## Quality assurance

**Code review:**

- Review for logic, readability, and maintainability
- Check error handling and edge cases
- Verify tests cover new functionality
- Ensure documentation is updated

**Continuous integration:**

- All tests must pass before merging
- Linting and formatting checks must pass
- Build process must complete successfully
- No breaking changes without proper migration
