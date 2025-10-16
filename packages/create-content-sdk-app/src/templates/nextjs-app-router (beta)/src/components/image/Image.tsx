'use client';
import {
  Field,
  ImageField,
  NextImage as ContentSdkImage,
  Link as ContentSdkLink,
  LinkField,
  Text,
  useSitecore,
} from '@sitecore-content-sdk/nextjs';
import React, { CSSProperties } from 'react';
import { ComponentProps } from 'lib/component-props';

interface ImageFields {
  Image: ImageField;
  ImageCaption: Field<string>;
  TargetUrl: LinkField;
}

interface ImageProps extends ComponentProps {
  fields: ImageFields;
}

const ImageWrapper: React.FC<{ className: string; id?: string; children: React.ReactNode }> = ({
  className,
  id,
  children,
}) => (
  <div className={className.trim()} id={id}>
    <div className="component-content">{children}</div>
  </div>
);

const ImageDefault: React.FC<ImageProps> = ({ params }) => (
  <ImageWrapper className={`component image ${params.styles}`}>
    <span className="is-empty-hint">Image</span>
  </ImageWrapper>
);

export const Banner: React.FC<ImageProps> = ({ params, fields }) => {
  const { page } = useSitecore();
  const { styles, RenderingIdentifier: id } = params;

  const backgroundStyle = fields?.Image?.value?.src
    ? ({ backgroundImage: `url('${fields.Image.value.src}')` } as CSSProperties)
    : {};

  const imageField = fields.Image && {
    ...fields.Image,
    value: {
      ...fields.Image.value,
      style: { width: '100%', height: '100%' },
    },
  };

  return (
    <div className={`component hero-banner ${styles}`.trim()} id={id}>
      <div className="component-content sc-sxa-image-hero-banner" style={backgroundStyle}>
        {page.mode.isEditing && <ContentSdkImage field={imageField} />}
      </div>
    </div>
  );
};

export const Default: React.FC<ImageProps> = (props) => {
  const { page } = useSitecore();
  const { fields, params } = props;
  const { styles, RenderingIdentifier: id } = params;

  if (!fields) {
    return <ImageDefault {...props} />;
  }

  const Image = () => <ContentSdkImage field={fields.Image} />;
  const shouldWrapWithLink = !page.mode.isEditing && fields.TargetUrl?.value?.href;

  return (
    <ImageWrapper className={`component image ${styles}`} id={id}>
      {shouldWrapWithLink ? (
        <ContentSdkLink field={fields.TargetUrl}>
          <Image />
        </ContentSdkLink>
      ) : (
        <Image />
      )}
      <Text tag="span" className="image-caption field-imagecaption" field={fields.ImageCaption} />
    </ImageWrapper>
  );
};
