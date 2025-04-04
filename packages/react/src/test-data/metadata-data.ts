export const layoutData = {
  sitecore: {
    context: {
      pageEditing: true,
    },
    route: {
      name: 'main',
      placeholders: {
        main: [
          {
            uid: 'nested123',
            componentName: 'Header',
            placeholders: {
              logo: [
                {
                  uid: 'deep123',
                  componentName: 'Logo',
                },
              ],
            },
          },
        ],
      },
    },
  },
};

export const layoutDataWithEmptyPlaceholder = {
  sitecore: {
    context: {
      pageEditing: true,
    },
    route: {
      name: 'main',
      placeholders: {
        main: [],
      },
    },
  },
};

export const layoutDataWithUnknownComponent = {
  sitecore: {
    context: {
      pageEditing: true,
    },
    route: {
      name: 'main',
      placeholders: {
        main: [
          {
            uid: '123',
            componentName: 'Unknown',
          },
        ],
      },
    },
  },
};

export const layoutDataForNestedDynamicPlaceholder = (rootPhKey: string) => ({
  sitecore: {
    context: {
      pageEditing: true,
    },
    route: {
      name: 'main',
      placeholders: {
        [rootPhKey]: [
          {
            uid: 'nested123',
            componentName: 'Header',
            placeholders: {
              logo: [
                {
                  uid: 'deep123',
                  componentName: 'Logo',
                },
              ],
            },
          },
        ],
      },
    },
  },
});
