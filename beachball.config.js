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
  
  // Change file directory
  changeFolder: 'change',
  
  // Branch configuration
  branch: 'dev',
  
  // Automatically update dependent packages
  bumpDeps: true,
  
  // Generate changelogs
  changelog: {
    groups: [
      {
        masterPackageName: '@sitecore-content-sdk/core',
        changelogPath: 'packages/core',
        include: ['@sitecore-content-sdk/core'],
      },
      {
        masterPackageName: '@sitecore-content-sdk/nextjs',
        changelogPath: 'packages/nextjs',
        include: ['@sitecore-content-sdk/nextjs'],
      },
      {
        masterPackageName: '@sitecore-content-sdk/react',
        changelogPath: 'packages/react',
        include: ['@sitecore-content-sdk/react'],
      },
      {
        masterPackageName: '@sitecore-content-sdk/cli',
        changelogPath: 'packages/cli',
        include: ['@sitecore-content-sdk/cli'],
      },
      {
        masterPackageName: '@sitecore-content-sdk/search',
        changelogPath: 'packages/search',
        include: ['@sitecore-content-sdk/search'],
      },
      {
        masterPackageName: 'create-content-sdk-app',
        changelogPath: 'packages/create-content-sdk-app',
        include: ['create-content-sdk-app'],
      },
    ],
  },
};

