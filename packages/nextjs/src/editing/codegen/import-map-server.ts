import React, {
  Children,
  Fragment,
  createElement,
  cloneElement,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  forwardRef,
  lazy,
  memo,
  Suspense,
} from 'react';
import { ImportEntry } from '@sitecore-content-sdk/content/codegen';
import { CdpHelper } from '@sitecore-content-sdk/content/personalize';
import {
  Link,
  Text,
  RichText,
  NextImage,
  Placeholder,
  Image,
  File,
  withDatasourceCheck,
} from '../..';

/**
 * The default import entries for the import map.
 * @public
 */
export const defaultServerImportEntries: ImportEntry[] = [
  /* -------------------- React -------------------- */
  {
    module: 'react',
    exports: [
      { name: 'default', value: React },
      { name: 'Children', value: Children },
      { name: 'Fragment', value: Fragment },
      { name: 'createElement', value: createElement },
      { name: 'cloneElement', value: cloneElement },
      { name: 'isValidElement', value: isValidElement },
      // Hooks
      { name: 'useCallback', value: useCallback },
      { name: 'useId', value: useId },
      { name: 'useMemo', value: useMemo },
      // Performance helpers
      { name: 'forwardRef', value: forwardRef },
      { name: 'lazy', value: lazy },
      { name: 'memo', value: memo },
      { name: 'Suspense', value: Suspense },
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
      { name: 'withDatasourceCheck', value: withDatasourceCheck },
      { name: 'CdpHelper', value: CdpHelper },
    ],
  },
];
