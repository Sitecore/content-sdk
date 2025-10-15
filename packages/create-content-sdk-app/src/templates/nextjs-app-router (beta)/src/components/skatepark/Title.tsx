import React from 'react';
import { ComponentParams, ComponentRendering, Link, Text } from '@sitecore-content-sdk/nextjs';

interface Fields {
  title: { value: string };
  link?: {
    value: {
      href: string;
      text?: string;
    };
  };
}

type TitleProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
};

export const Title = (props: TitleProps) => {
  const { title, link } = props.fields || {};

  return (
    <div className="component title">
      <div className="component-content">
        {link?.value?.href ? (
          <Link field={link}>
            <Text tag="h2" className="title-text" field={title} />
          </Link>
        ) : (
          <Text tag="h2" className="title-text" field={title} />
        )}
      </div>
    </div>
  );
};
