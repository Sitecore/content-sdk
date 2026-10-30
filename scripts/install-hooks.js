const fs = require('fs');
// avoid side effects in CI
if (process.env.CI) return;
const preCommitChangesets = `#!/bin/sh
#
# pre-commit hook that splits the staged multi-package changesets into one
# changeset per package and stages the result. Other changesets are left as they are.
#

files=$(git diff --cached --name-only --diff-filter=AM -- '.changeset/*.md' ':!.changeset/README.md')
[ -z "$files" ] && exit 0

if [ ! -d node_modules ]; then
  echo "pre-commit: dependencies not installed, changesets not split (run yarn install)." >&2
  exit 0
fi

before=$(mktemp)
trap 'rm -f "$before"' EXIT
git ls-files --others --exclude-standard -- .changeset | sort > "$before"

# Changeset file names have no spaces.
yarn csdk:split-changesets $files || exit 1

# Stage the removal of the split originals and the new single-package files.
for file in $files; do
  [ -e "$file" ] || git rm -q --cached -- "$file"
done
git ls-files --others --exclude-standard -- .changeset | sort | comm -13 "$before" - |
  while read -r file; do git add -- "$file"; done`;

const prePushDefault = `#!/bin/sh
#
# pre-push hook that runs our linter so we don't have to wait for
# CI to do it for us!
#
# To skip this hook, use the --no-verify flag
# when pushing.
#

echo "Linting packages..."
npm run lint-packages;`;

const hooks = {
  'pre-commit': preCommitChangesets,
  'pre-push': prePushDefault,
};

const installHook = (name) => {
  // \x1b[32m%s\x1b[0m - set color to green, insert the string, reset color after string is logged to console
  console.log('\x1b[32m%s\x1b[0m', `Writing ${name} hook to local .git folder...`);

  // Write the hook to the local .git folder. Using writeFile in order to catch any errors
  /* eslint-disable no-unused-vars */
  fs.writeFile(`./.git/hooks/${name}`, hooks[name], { encoding: 'utf8', mode: 0o755 }, (err, _) => {
    if (err) {
      console.log('\x1b[31m%o\x1b[0m', err);
      return;
    }
    console.log('\x1b[32m%s\x1b[0m', 'Success!');
  });
};

installHook('pre-commit');
if (process.argv.includes('--pre-push')) installHook('pre-push');
