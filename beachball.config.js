const { changelog } = require('./.beachball/beach-utils.js');

module.exports = {
  // Independent versioning mode
  disallowedChangeTypes: [],

  // Explicitly enable changelog generation
  generateChangelog: 'md',

  // Packages to include
  packages: {
    'packages/core': {
      disallowedChangeTypes: [],
    },
    'packages/nextjs': {
      disallowedChangeTypes: [],
    },
    'packages/react': {
      disallowedChangeTypes: [],
    },
    'packages/cli': {
      disallowedChangeTypes: [],
    },
    'packages/search': {
      disallowedChangeTypes: [],
    },
    'packages/create-content-sdk-app': {
      disallowedChangeTypes: [],
    },
  },

  // Branch configuration
  branch: 'dev',

  // Automatically update dependent packages
  bumpDeps: true,

  // Generate changelogs that includes commit links
  changelog: {
    customRenderers: changelog, // Custom renderer adds commit links to entries
  },
};
