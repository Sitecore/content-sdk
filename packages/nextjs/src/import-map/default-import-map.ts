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

export const defaultImportEntries: ImportEntry[] = [
  /* -------------------- React -------------------- */
  {
    module: 'react',
    exports: [
      { name: 'default', value: React },
      { name: '*', value: React },
      { name: 'Children', value: React.Children },
      { name: 'Fragment', value: React.Fragment },
      { name: 'createElement', value: React.createElement },
      { name: 'cloneElement', value: React.cloneElement },
      { name: 'isValidElement', value: React.isValidElement },
      /* Hooks */
      { name: 'useActionState', value: React.useActionState },
      { name: 'useCallback', value: React.useCallback },
      { name: 'useContext', value: React.useContext },
      { name: 'useDeferredValue', value: React.useDeferredValue },
      { name: 'useEffect', value: React.useEffect },
      { name: 'useId', value: React.useId },
      { name: 'useLayoutEffect', value: React.useLayoutEffect },
      { name: 'useMemo', value: React.useMemo },
      { name: 'useOptimistic', value: React.useOptimistic },
      { name: 'useReducer', value: React.useReducer },
      { name: 'useRef', value: React.useRef },
      { name: 'useState', value: React.useState },
      { name: 'useSyncExternalStore', value: React.useSyncExternalStore },
      { name: 'useTransition', value: React.useTransition },
      /* Performance helpers */
      { name: 'forwardRef', value: React.forwardRef },
      { name: 'lazy', value: React.lazy },
      { name: 'memo', value: React.memo },
      { name: 'Suspense', value: React.Suspense },
    ],
  },

  /* ------------- Sitecore Content‑SDK ------------- */
  {
    module: '@sitecore-content-sdk/nextjs',
    exports: [
      { name: 'Link', value: Link },
      { name: 'Text', value: Text },
      { name: 'RichText', value: RichText },
      { name: 'Placeholder', value: Placeholder },
      { name: 'NextImage', value: NextImage },
      { name: 'Image', value: Image },
      { name: 'File', value: File },
      { name: 'useSitecore', value: useSitecore },
      { name: 'withSitecore', value: withSitecore },
      { name: 'useComponentProps', value: useComponentProps },
      { name: 'withDatasourceCheck', value: withDatasourceCheck },
      { name: 'CdpHelper', value: CdpHelper },
    ],
  },
];
