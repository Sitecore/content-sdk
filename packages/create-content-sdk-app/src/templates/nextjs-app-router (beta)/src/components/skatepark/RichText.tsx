import React from 'react';
import {
  ComponentParams,
  ComponentRendering,
  RichText as SitecoreRichText,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  text: { value: string };
}

type RichTextProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
};

export const RichText = (props: RichTextProps) => {
  const { text } = props.fields || {};

  return (
    <div className="component rich-text">
      <div className="component-content">
        {text ? (
          <SitecoreRichText field={text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}
      </div>
    </div>
  );
};
