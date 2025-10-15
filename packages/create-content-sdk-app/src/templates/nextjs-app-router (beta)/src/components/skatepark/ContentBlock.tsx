import React from 'react';
import { ComponentParams, ComponentRendering, RichText, Text } from '@sitecore-content-sdk/nextjs';

interface Fields {
  heading: { value: string };
  content: { value: string };
}

type ContentBlockProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
};

/**
 * A simple Content Block component with a heading and rich text block.
 * This is the most basic building block of a content site.
 */
export const ContentBlock = (props: ContentBlockProps) => {
  const { heading, content } = props.fields || {};

  return (
    <div className="component content-block">
      <div className="component-content">
        {heading && <Text tag="h2" className="content-heading" field={heading} />}
        {content && <RichText className="content-text" field={content} />}
      </div>
    </div>
  );
};
