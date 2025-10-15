import React from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Image as SitecoreImage,
  Link,
  Text,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  image: {
    value: {
      src: string;
      alt: string;
      width?: string;
      height?: string;
    };
  };
  imageCaption?: { value: string };
  targetUrl?: {
    value: {
      href: string;
      text?: string;
    };
  };
}

type ImageProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
};

export const Image = (props: ImageProps) => {
  const { image, imageCaption, targetUrl } = props.fields || {};

  const ImageComponent = () => <SitecoreImage field={image} />;

  return (
    <div className="component image">
      <div className="component-content">
        {targetUrl?.value?.href ? (
          <Link field={targetUrl}>
            <ImageComponent />
          </Link>
        ) : (
          <ImageComponent />
        )}
        {imageCaption && <Text tag="span" className="image-caption" field={imageCaption} />}
      </div>
    </div>
  );
};
