import React, { JSX } from 'react';
import { RichText as JssRichText, useSitecore, RichTextField } from '@sitecore-content-sdk/nextjs';

interface Fields {
  Content: RichTextField;
}

type PageContentProps = {
  params: { [key: string]: string };
  fields: Fields;
};

type ComponentContentProps = {
  id: string;
  styles: string;
  children: JSX.Element;
};

const ComponentContent = (props: ComponentContentProps) => {
  const id = props.id;
  return (
    <div className={`component content ${props.styles}`} id={id ? id : undefined}>
      <div className="component-content">
        <div className="field-content">{props.children}</div>
      </div>
    </div>
  );
};

export const Default = (props: PageContentProps): JSX.Element => {
  const { pageContext } = useSitecore();
  const id = props.params.RenderingIdentifier;

  if (!(props.fields && props.fields.Content) && !pageContext?.route?.fields?.Content) {
    return (
      <div className={`component content ${props.params.styles}`} id={id ? id : undefined}>
        <div className="component-content">
          <div className="field-content">[Content]</div>
        </div>
      </div>
    );
  }

  const field = (
    props.fields && props.fields.Content
      ? props.fields.Content
      : pageContext?.route?.fields?.Content
  ) as RichTextField;

  return (
    <ComponentContent styles={props.params.styles} id={id}>
      <JssRichText field={field} />
    </ComponentContent>
  );
};
