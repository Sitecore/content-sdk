'use client';
import React, { ReactElement, useMemo } from 'react';
import { isFieldValueEmpty, type TextField } from '@sitecore-content-sdk/content/layout';
import { omitJavascriptUrls } from '@sitecore-content-sdk/core/tools';
import { withFieldMetadata } from '../enhancers/withFieldMetadata';
import { withEmptyFieldEditingComponent } from '../enhancers/withEmptyFieldEditingComponent';
import { DefaultEmptyFieldEditingComponentText } from './DefaultEmptyFieldEditingComponents';
import { EditableFieldProps } from './sharedTypes';
import { useOmittedJavascriptUrlLog } from './use-omitted-javascript-url-log';

export interface TextProps extends EditableFieldProps<TextProps> {
  [htmlAttributes: string]: unknown;
  /** The text field data. */
  field?: TextField;
  /**
   * The HTML element that will wrap the contents of the field.
   */
  tag?: string;
  /**
   * If false, HTML-encoding of the field value is disabled and the value is rendered as-is.
   */
  encode?: boolean;
}

const TextComponent: React.FC<TextProps> = ({
  field,
  tag,
  editable = true,
  encode = true,
  ...otherProps
}) => {
  const rawValue = field?.value;
  // Unencoded values go to innerHTML, where React does not block javascript: URLs.
  const unencoded = useMemo(
    () =>
      encode || rawValue === undefined || rawValue === null
        ? undefined
        : omitJavascriptUrls(String(rawValue).split('\n').join('<br>')),
    [encode, rawValue]
  );

  useOmittedJavascriptUrlLog(unencoded?.omittedUrls ?? []);

  if (isFieldValueEmpty(field)) {
    return null;
  }

  // can't use editable value if we want to output unencoded
  if (!encode) {
    // eslint-disable-next-line no-param-reassign, no-unused-vars
    editable = false;
  }

  const value = field.value ?? '';

  let children = null;
  const htmlProps: {
    [htmlAttributes: string]: unknown;
    children?: React.ReactNode;
  } = {
    ...otherProps,
  };

  if (!encode) {
    htmlProps.dangerouslySetInnerHTML = {
      __html: unencoded?.html ?? '',
    };
  } else {
    let output: string | number | (ReactElement | string)[] = value;

    // when string value isn't formatted, we should format line breaks
    const splitted = String(output).split('\n');

    if (splitted.length) {
      const formatted: (ReactElement | string)[] = [];

      splitted.forEach((str, i) => {
        const isLast = i === splitted.length - 1;

        formatted.push(str);

        if (!isLast) {
          formatted.push(<br key={i} />);
        }
      });

      output = formatted;
    }

    children = output;
  }

  const Tag = (tag || 'span') as React.ElementType;

  if (field.metadata) {
    return (
      <Tag {...htmlProps} suppressHydrationWarning={true}>
        {children}
      </Tag>
    );
  } else if (tag || !encode) {
    return <Tag {...htmlProps}>{children}</Tag>;
  } else {
    return <React.Fragment>{children}</React.Fragment>;
  }
};

/**
 * The Text component.
 * @public
 */
export const Text: React.FC<TextProps> = withFieldMetadata<TextProps>(
  withEmptyFieldEditingComponent(TextComponent, {
    defaultEmptyFieldEditingComponent: DefaultEmptyFieldEditingComponentText,
  })
);

Text.displayName = 'Text';
