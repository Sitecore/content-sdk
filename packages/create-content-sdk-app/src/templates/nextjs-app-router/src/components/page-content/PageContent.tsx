'use client';
import React, { JSX } from 'react';
import {
  RichText as ContentSdkRichText,
  useSitecore,
  RichTextField,
} from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Content: RichTextField;
}

type PageContentProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: PageContentProps): JSX.Element => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;

  const field = fields?.Content ?? (page.layout.sitecore.route?.fields?.Content as RichTextField);

  return (
    <div className={`component content ${styles}`} id={id}>
      <div className="component-content">
        <div className="field-content">
          {field ? <ContentSdkRichText field={field} /> : '[Content]'}
        </div>
      </div>
    </div>
  );
};
