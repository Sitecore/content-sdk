'use client';

import React, {
  Children,
  Fragment,
  createElement,
  cloneElement,
  isValidElement,
  useActionState,
  useCallback,
  useContext,
  useDeferredValue,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useOptimistic,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
  forwardRef,
  lazy,
  memo,
  Suspense,
} from 'react';
import { ImportEntry } from '@sitecore-content-sdk/content/codegen';
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
} from '../..';

/**
 * The default import entries for the import map.
 * @public
 */
export const defaultImportEntries: ImportEntry[] = [
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
      { name: 'useActionState', value: useActionState },
      { name: 'useCallback', value: useCallback },
      { name: 'useContext', value: useContext },
      { name: 'useDeferredValue', value: useDeferredValue },
      { name: 'useEffect', value: useEffect },
      { name: 'useId', value: useId },
      { name: 'useLayoutEffect', value: useLayoutEffect },
      { name: 'useMemo', value: useMemo },
      { name: 'useOptimistic', value: useOptimistic },
      { name: 'useReducer', value: useReducer },
      { name: 'useRef', value: useRef },
      { name: 'useState', value: useState },
      { name: 'useSyncExternalStore', value: useSyncExternalStore },
      { name: 'useTransition', value: useTransition },
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
      { name: 'useSitecore', value: useSitecore },
      { name: 'withSitecore', value: withSitecore },
      { name: 'useComponentProps', value: useComponentProps },
      { name: 'withDatasourceCheck', value: withDatasourceCheck },
      { name: 'CdpHelper', value: CdpHelper },
    ],
  },
];

/**
 * Combines the default import entries with the generated import entries.
 * @param {ImportEntry[]} defaultImportEntries - The default import entries.
 * @param {ImportEntry[]} generatedImportEntries - The generated import entries.
 * @returns {ImportEntry[]} The combined import entries.
 * @public
 */
export const combineImportEntries = (
  defaultImportEntries: ImportEntry[],
  generatedImportEntries: ImportEntry[]
): ImportEntry[] => {
  const combinedEntries: ImportEntry[] = [];
  const importMap = new Map<string, ImportEntry>();

  // add generated entries to the map, overwriting existing ones
  generatedImportEntries.forEach((entry) => {
    importMap.set(entry.module, entry);
  });

  // add default entries to the map, if not present
  defaultImportEntries.forEach((defaultEntry) => {
    const mapEntry = importMap.get(defaultEntry.module);
    if (mapEntry) {
      defaultEntry.exports.forEach((defaultExportsEntry) => {
        if (!mapEntry.exports.some((e) => e.name === defaultExportsEntry.name)) {
          mapEntry.exports.push(defaultExportsEntry);
        }
      });
    } else {
      importMap.set(defaultEntry.module, defaultEntry);
    }
  });

  // convert map back to array
  importMap.forEach((value) => {
    combinedEntries.push(value);
  });

  return combinedEntries;
};
