// parse version input and put value for further processing into GH output
const versionInput = process.argv[2];

if (!versionInput || !versionInput.match(/^(\d+\.\d+)(\..+)?$/)) {
  console.error(`❌ Invalid version input: ${versionInput}`);
  process.exit(1);
}

const version = versionInput.match(/^(\d+\.\d+)/)[1];
console.log(`version=${version}`);
