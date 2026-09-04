import React from 'react';
import type { ComponentRegistry, ComponentRenderer, ComponentRenderProps } from '@json-render/react';
import { useRepeatScope } from '@json-render/react';
import type { Document } from '@sitecore-content-sdk/content/atoms';
import { MetadataKind } from '@sitecore-content-sdk/content/editing';
import type { AtomsCatalog, AtomsCatalogInput } from './types';
import { ATOM_TYPE } from './constants';

/**
 * Internal prop name used to carry an element's flat-spec key through json-render's renderer,
 * since `ComponentRenderProps` does not otherwise expose it. Injected by `withElementChromeKeys`
 * and stripped by `withEditingChrome` before the real atom implementation ever sees it.
 * @internal
 */
export const CHROME_ELEMENT_KEY_PROP = '__csdkChromeElementKey';

/**
 * Returns a copy of the document where every element's props carry their own flat-spec key
 * under {@link CHROME_ELEMENT_KEY_PROP}, so `withEditingChrome` can read it at render time.
 * @param {Document} doc - Component Layout document (flat spec format)
 * @returns {Document} A shallow copy of `doc` with keys injected into each element's props
 * @internal
 */
export function withElementChromeKeys(doc: Document): Document {
  if (!doc.elements) {
    return doc;
  }

  const elements: Document['elements'] = {};

  for (const [key, element] of Object.entries(doc.elements)) {
    elements[key] = {
      ...element,
      props: { ...(element.props as Record<string, unknown> | undefined), [CHROME_ELEMENT_KEY_PROP]: key },
    };
  }

  return { ...doc, elements };
}

/**
 * Wraps a registry component renderer with Sitecore editing chrome
 * (`<code type="text/sitecore" chrometype="atom">`), so every atom is automatically
 * selectable/editable/draggable in Pages and Design Studio with no developer effort.
 *
 * Reads the element's flat-spec key (injected by `withElementChromeKeys`) for the chrome id,
 * appending the current repeat index via `useRepeatScope()` when rendered inside a repeat scope.
 * @param {ComponentRenderer} Component - The registry component renderer to wrap
 * @param {AtomsCatalogInput['components'][string]} [componentDefinition] - The catalog definition for the component
 * @returns {ComponentRenderer} A component renderer that renders the same output surrounded by atom chrome
 * @internal
 */
export function withEditingChrome(
  Component: ComponentRenderer,
  componentDefinition?: AtomsCatalogInput['components'][string]
): ComponentRenderer {
  const WithEditingChrome = ({ element, ...rest }: ComponentRenderProps) => {
    const repeatScope = useRepeatScope();
    const elementProps = (element.props ?? {}) as Record<string, unknown>;
    const { [CHROME_ELEMENT_KEY_PROP]: elementKey, ...cleanProps } = elementProps;

    if (typeof elementKey !== 'string') {
      return <Component element={element} {...rest} />;
    }

    const indexedElementKey = repeatScope ? `${elementKey}_${repeatScope.index}` : elementKey;
    const baseAttributes = { type: 'text/sitecore', chrometype: ATOM_TYPE, className: 'scpm' };
    const openAttributes = {
      ...baseAttributes,
      kind: MetadataKind.Open,
      'data-element-name': indexedElementKey,
      'data-atom-type': element.type,
      ...(componentDefinition?.slots ? { 'data-atom-slots': JSON.stringify(componentDefinition.slots) } : {}),
    };
    const closeAttributes = { ...baseAttributes, kind: MetadataKind.Close };

    return (
      <>
        <code {...openAttributes} />
        <Component element={{ ...element, props: cleanProps }} {...rest} />
        <code {...closeAttributes} />
      </>
    );
  };

  WithEditingChrome.displayName = `withEditingChrome(${Component.displayName || Component.name || 'Component'})`;

  return WithEditingChrome;
}

/**
 * Wraps every component in a registry with {@link withEditingChrome}.
 * @param {ComponentRegistry} registry - The registry produced by `defineAtomsRegistry`
 * @param {AtomsCatalog} catalog - The catalog containing component slot definitions
 * @returns {ComponentRegistry} A new registry with every component wrapped in atom editing chrome
 * @internal
 */
export function withEditingChromeRegistry(
  registry: ComponentRegistry,
  catalog: AtomsCatalog
): ComponentRegistry {
  const wrapped: ComponentRegistry = {};

  for (const [type, Component] of Object.entries(registry)) {
    wrapped[type] = withEditingChrome(Component, catalog.data.components[type]);
  }

  return wrapped;
}
