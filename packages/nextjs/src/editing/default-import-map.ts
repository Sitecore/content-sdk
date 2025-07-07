import * as React from 'react';
import {
  Link,
  Text,
  RichText,
  useSitecore,
  NextImage,
  Placeholder,
  Image,
  File,
  useComponentProps,
  withDatasourceCheck,
  CdpHelper,
  withSitecore,
} from '..';

export interface ImportEntry {
  module: string;
  exports: { name: string | 'default' | '*'; value: unknown }[];
}

export const importEntries: ImportEntry[] = [
  {
    module: 'react',
    exports: [
      { name: 'default', value: React },
      { name: '*', value: React },
      { name: 'createElement', value: React.createElement },
      { name: 'Fragment', value: React.Fragment },
      { name: 'Children', value: React.Children },
      { name: 'cloneElement', value: React.cloneElement },
      { name: 'isValidElement', value: React.isValidElement },

      /* Hooks */
      { name: 'useState', value: React.useState },
      { name: 'useEffect', value: React.useEffect },
      { name: 'useLayoutEffect', value: React.useLayoutEffect },
      { name: 'useContext', value: React.useContext },
      { name: 'useMemo', value: React.useMemo },
      { name: 'useCallback', value: React.useCallback },
      { name: 'useRef', value: React.useRef },
      { name: 'useId', value: React.useId },
      { name: 'useTransition', value: React.useTransition },
      { name: 'useDeferredValue', value: React.useDeferredValue },
      { name: 'useReducer', value: React.useReducer },
      { name: 'useSyncExternalStore', value: React.useSyncExternalStore },
      { name: 'useActionState', value: React.useActionState },
      { name: 'useOptimistic', value: React.useOptimistic },

      /* Performance / async helpers */
      { name: 'memo', value: React.memo },
      { name: 'forwardRef', value: React.forwardRef },
      { name: 'lazy', value: React.lazy },
      { name: 'Suspense', value: React.Suspense },
    ],
  },
  {
    module: '@sitecore-content-sdk/nextjs',
    exports: [
      // Visual/content helpers
      { name: 'Link', value: Link },
      { name: 'Text', value: Text },
      { name: 'useSitecore', value: useSitecore },
      { name: 'Placeholder', value: Placeholder },
      { name: 'RichText', value: RichText },
      { name: 'NextImage', value: NextImage },
      { name: 'withDatasourceCheck', value: withDatasourceCheck },
      { name: 'CdpHelper', value: CdpHelper },
      { name: 'File', value: File },
      { name: 'useComponentProps', value: useComponentProps },
      { name: 'Image', value: Image },

      // Sitecore context
      { name: 'withSitecore', value: withSitecore },
      { name: 'useSitecore', value: useSitecore },

      // Datasource & editing
      { name: 'useComponentProps', value: useComponentProps },
      { name: 'withDatasourceCheck', value: withDatasourceCheck },

      // Utility helpers
      { name: 'CdpHelper', value: CdpHelper },
    ],
  },
];
