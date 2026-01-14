// find release tag for patch release prep based on GH action input values
const { execSync } = require('child_process');

const [pkg, version] = [process.argv[2], process.argv[3]];
if (!pkg || !version) process.exit(1);

const git = (cmd) => {
  try {
    return execSync(`git ${cmd}`, { encoding: 'utf8' }).trim();
  } catch {
    return '';
  }
};

const tagPrefix = `${pkg}@${version}.`;
const tags = git(`tag --list "${tagPrefix}*"`).split('\n').filter(Boolean);

let latestTag = null,
  latestPatch = -1;
for (const tag of tags) {
  const patch = parseInt(tag.replace(tagPrefix, ''), 10);
  if (!isNaN(patch) && patch > latestPatch) {
    latestPatch = patch;
    latestTag = tag;
  }
}

if (!latestTag) {
  console.error(`No tags found for ${tagPrefix}*`);
  process.exit(1);
}

console.log(`latest_tag=${latestTag}`);
console.log(`next_version=${version}.x`);
