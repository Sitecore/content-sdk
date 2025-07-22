import { GraphQLEditingQueryResponse } from '../editing/editing-service';

export const mockEditingServiceResponse = (): { data: GraphQLEditingQueryResponse } => ({
  data: {
    item: {
      rendered: {
        sitecore: {
          context: {
            pageEditing: true,
            language: 'en',
          },
          route: {
            name: 'Sample',
            placeholders: {
              main: [
                {
                  componentName: 'Sample',
                  fields: {
                    title: {
                      value: 'Hello world!',
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
});
