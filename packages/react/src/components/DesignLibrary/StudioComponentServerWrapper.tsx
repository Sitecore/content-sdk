import React from 'react';
import { StudioComponentWrapper } from './StudioComponentWrapper';
import {
  NativeDataFetcher,
  NativeDataFetcherResponse,
  getAtomsCssCompiler,
} from '@sitecore-content-sdk/core';
import { debug } from '@sitecore-content-sdk/content';
import { Document } from '@sitecore-content-sdk/content/atoms';
import { resolveEdgeUrl } from '@sitecore-content-sdk/core/tools';
import { extractDocumentClasses } from '../../atoms/extract-document-classes';
import type { ChildComponentProps } from '../Placeholder/models';

/**
 * Props accepted by the RSC `StudioComponentServerWrapper`.
 * @internal
 */
export type StudioComponentServerWrapperProps = {
  /**
   * Pipe separated relative paths to the Studio component layout JSON in MMS with the last segment as the variant name. The path matching `FieldNames` will be used, or `default` if no match.
   */
  componentRef: string;
  /**
   * Field name to match against the last segment of the `componentRef` paths. If no match is found, the `default` path will be used.
   */
  fieldNames?: string;
  /**
   * Sitecore component fields passed from the rendering context.
   */
  fields: ChildComponentProps['fields'];
  /**
   * Sitecore rendering parameters passed from the rendering context.
   */
  params: ChildComponentProps['params'];
};

/**
 * Server component for Studio (NCC) components. Fetches the component layout
 * `Document` from MMS server-side, optionally compiles Document class names into
 * CSS (via the registered atoms CSS compiler), and renders the client
 * `StudioComponentWrapper`.
 * @param {StudioComponentServerWrapperProps} props incoming props
 * @returns Fragment with optional `<style>` tag and `StudioComponentWrapper`
 * @internal
 */
export const StudioComponentServerWrapper = async (props: StudioComponentServerWrapperProps) => {
  const componentRef = props.componentRef || '';
  if (!componentRef) return null;

  const path = extractVariantPathFromComponentRef(componentRef, props.fieldNames);
  if (!path) return null;

  const document = await fetchDocument(path);
  if (!document) return null;

  const classes = extractDocumentClasses(document);
  const compiler = getAtomsCssCompiler();
  let css = '';

  if (classes.length) {
    if (compiler) {
      try {
        css = await compiler(classes);
      } catch (err) {
        debug.editing('StudioComponentServerWrapper: CSS compile failed %o', err);
      }
    } else {
      debug.editing(
        'StudioComponentServerWrapper: Document has class names but no atoms CSS compiler is registered. ' +
          'Call registerTailwindCssCompiler() from @sitecore-content-sdk/nextjs/instrumentation in instrumentation-node.ts.'
      );
    }
  }

  return (
    <>
      {css ? <style dangerouslySetInnerHTML={{ __html: css }} /> : null}
      <StudioComponentWrapper document={document} fields={props.fields} params={props.params} />
    </>
  );
};

/**
 * Extracts the variant path from a component reference.
 * @param {string} componentRef The component reference string.
 * @param {string} fieldNames The field names to extract the variant path for.
 * @returns {string} The variant path.
 * @internal
 */
function extractVariantPathFromComponentRef(
  componentRef: string,
  fieldNames: string = 'default'
): string | null {
  const paths = componentRef.split('|').reduce((acc, part) => {
    const path = part.trim();
    const segments = path.split('/');
    const variant = segments[segments.length - 1];

    acc.set(variant, path);

    return acc;
  }, new Map<string, string>());

  const path = paths.get(fieldNames) || paths.get('default') || null;

  if (!path) {
    console.warn(
      `StudioComponentServerWrapper: failed to extract path from ComponentRef "${componentRef}" with fieldNames "${fieldNames}". ` +
        'Ensure the ComponentRef is in the expected format and that the correct fieldNames are provided.'
    );
  }

  return path;
}

/**
 * Prefix for MMS component paths in componentRef. The final URL will be resolved as `${host}/${MMS_COMPONENT_PATH_PREFIX}/${path}`.
 */
const MMS_COMPONENT_PATH_PREFIX = 'mms';

/**
 * Fetch a Studio component layout `Document` by reference.
 * @param {string} path extracted component reference (path) from `params.ComponentRef`
 * @returns {Promise<Document | null>} the resolved component layout, or `null` on missing path, fetch failure, or un-parseable body.
 */
async function fetchDocument(path: string): Promise<Document | null> {
  let url: string;
  try {
    const pathWithMmsPrefix = path.startsWith('/')
      ? `/${MMS_COMPONENT_PATH_PREFIX}${path}`
      : `/${MMS_COMPONENT_PATH_PREFIX}/${path}`;

    const hostURL = resolveEdgeUrl();

    url = new URL(pathWithMmsPrefix, hostURL).toString();
  } catch (err) {
    console.error(`StudioComponentServerWrapper: failed to resolve component from "${path}"`, err);
    return null;
  }

  let response: NativeDataFetcherResponse<string>;
  try {
    const fetcher = new NativeDataFetcher({ debugger: debug.layout });
    response = await fetcher.get(url);
  } catch (error) {
    console.error(
      `StudioComponentServerWrapper: failed to fetch component layout from ${url}`,
      error
    );
    return null;
  }

  try {
    const document: Document = JSON.parse(response.data);

    return document;
  } catch (err) {
    console.error(
      `StudioComponentServerWrapper: failed to parse component layout response from ${url}`,
      err
    );
    return null;
  }
}
