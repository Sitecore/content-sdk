import React, { JSX } from 'react';
import { RichText as JssRichText, useSitecore, RichTextField } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Content: RichTextField;
}

type PageContentProps = ComponentProps & {
  fields: Fields;
};

export const Default = ({ params, fields }: PageContentProps): JSX.Element => {
  const { pageContext } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;

  const field = fields?.Content ?? (pageContext?.route?.fields?.Content as RichTextField);

  return (
    <div className={`component content ${styles}`} id={id}>
      <div className="component-content">
        <div className="field-content">{field ? <JssRichText field={field} /> : '[Content]'}</div>
      </div>
    </div>
  );
};
