const { changelog } = require('./.beachball/beach-utils.js');

module.exports = {
  // Independent versioning mode
  disallowedChangeTypes: [],

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

  // Generate changelogs
  changelog: {
    customRenderers: changelog,
    groups: [
      {
        mainPackageName: '@sitecore-content-sdk/nextjs',
        include: ['@sitecore-content-sdk/core', '@sitecore-content-sdk/react'],
        changelogPath: 'packages/nextjs',
      },
      {
        masterPackageName: '@sitecore-content-sdk/react',
        changelogPath: 'packages/react',
        include: ['@sitecore-content-sdk/core', '@sitecore-content-sdk/react'],
      },
      {
        masterPackageName: '@sitecore-content-sdk/cli',
        changelogPath: 'packages/cli',
        include: ['@sitecore-content-sdk/core', '@sitecore-content-sdk/cli'],
      },
      {
        masterPackageName: '@sitecore-content-sdk/search',
        changelogPath: 'packages/search',
        include: ['@sitecore-content-sdk/core', '@sitecore-content-sdk/search'],
      },
      {
        masterPackageName: 'create-content-sdk-app',
        changelogPath: 'packages/create-content-sdk-app',
        include: ['create-content-sdk-app'],
      },
    ],
  },
};
