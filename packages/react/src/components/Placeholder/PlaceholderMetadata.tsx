import React, { ReactNode, JSX } from 'react';
import {
  ComponentRendering,
  getDynamicPlaceholderPattern,
  isDynamicPlaceholder,
} from '@sitecore-content-sdk/content/layout';
import { MetadataKind, DEFAULT_PLACEHOLDER_UID } from '@sitecore-content-sdk/content/editing';

/**
 *  Props containing the component data to render.
 */
export interface PlaceholderMetadataProps {
  rendering: ComponentRendering;
  placeholderName?: string;
  children?: ReactNode;
  /**
   * Component runtime type. Used to add data-csdk-component-runtime attribute to rendering chromes
   */
  componentRuntime?: 'server' | 'client';
}

export type CodeBlockAttributes = {
  type: string;
  chrometype: string;
  className: string;
  kind: string;
  id?: string;
  'data-csdk-component-runtime'?: 'server' | 'client';
};

/**
 * A React component to generate metadata blocks for a placeholder or rendering.
 * It utilizes dynamic attributes based on whether the component acts as a placeholder
 * or as a rendering to properly render the surrounding code blocks.
 * @param {object} props The properties passed to the component.
 * @param {ComponentRendering} props.rendering The rendering data.
 * @param {string} [props.placeholderName] The name of the placeholder.
 * @param {'server' | 'client'} [props.componentRuntime] Component runtime type. Used to add data-csdk-component-runtime attribute to rendering chromes.
 * @param {JSX.Element} props.children The child components or elements to be wrapped by the metadata code blocks.
 * @returns {JSX.Element} A React fragment containing open and close code blocks surrounding the children elements.
 */
export const PlaceholderMetadata = ({
  rendering,
  placeholderName,
  children,
  componentRuntime,
}: PlaceholderMetadataProps): JSX.Element => {
  const getCodeBlockAttributes = ({
    kind,
    id,
    placeholderName,
  }: {
    kind: MetadataKind;
    id?: string;
    placeholderName?: string;
  }): CodeBlockAttributes => {
    const chrometype = placeholderName ? 'placeholder' : 'rendering';

    const attributes: CodeBlockAttributes = {
      type: 'text/sitecore',
      chrometype: chrometype,
      className: 'scpm',
      kind: kind,
    };

    if (kind === MetadataKind.Open) {
      if (chrometype === 'placeholder' && placeholderName) {
        let phId = '';

        for (const placeholder of Object.keys(rendering.placeholders ?? {})) {
          if (placeholderName === placeholder) {
            phId = id
              ? `${placeholderName}_${id}`
              : `${placeholderName}_${DEFAULT_PLACEHOLDER_UID}`;
            break;
          }

          // Check if the placeholder is a dynamic placeholder
          if (isDynamicPlaceholder(placeholder)) {
            const pattern = getDynamicPlaceholderPattern(placeholder);

            // Check if the placeholder matches the dynamic placeholder pattern
            if (pattern.test(placeholderName)) {
              phId = id ? `${placeholder}_${id}` : `${placeholder}_${DEFAULT_PLACEHOLDER_UID}`;
              break;
            }
          }
        }

        attributes.id = phId;
      } else {
        attributes.id = id;
      }

      // Add component runtime attribute for rendering chromes
      if (chrometype === 'rendering' && componentRuntime) {
        attributes['data-csdk-component-runtime'] = componentRuntime;
      }
    }

    return attributes;
  };

  return (
    <>
      <code
        {...getCodeBlockAttributes({ kind: MetadataKind.Open, id: rendering.uid, placeholderName })}
      />
      {children}
      <code {...getCodeBlockAttributes({ kind: MetadataKind.Close, placeholderName })} />
    </>
  );
};
