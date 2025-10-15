import React from 'react';
import { ComponentParams, ComponentRendering, Image, Text } from '@sitecore-content-sdk/nextjs';

interface Fields {
  heading: { value: string };
  subheading: { value: string };
  backgroundImage: {
    value: {
      src: string;
      alt: string;
    };
  };
}

type HeroProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
};

export const Hero = (props: HeroProps) => {
  const { heading, subheading, backgroundImage } = props.fields || {};

  return (
    <section className="hero">
      {backgroundImage && (
        <div className="hero-background">
          <Image field={backgroundImage} />
        </div>
      )}
      <div className="hero-content">
        {heading && <Text tag="h1" className="hero-heading" field={heading} />}
        {subheading && <Text tag="p" className="hero-subheading" field={subheading} />}
      </div>
    </section>
  );
};
