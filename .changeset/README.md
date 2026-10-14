# Changesets

Changesets allows flexible management of multiple packages in a monorepo

[Changeset docs](https://github.com/changesets/changesets)
[Common questions](https://github.com/changesets/changesets/blob/main/docs/common-questions.md)

Quick references:
- `yarn changeset:add` - add a changeset for current changes, split into one changeset per package.
- `yarn changeset <command>` - the changesets CLI itself (e.g. `yarn changeset status`, `yarn changeset pre enter`).
- `yarn changeset:cascade-version` - apply version changes from current changesets onto the monrepo (usually runs via CI)
