import React from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Image,
  Link,
  RichText,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  promoIcon: {
    value: {
      src: string;
      alt: string;
    };
  };
  promoText: { value: string };
  promoLink: {
    value: {
      href: string;
      text: string;
    };
  };
}

type PromoProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
};

export const Promo = (props: PromoProps) => {
  const { promoIcon, promoText, promoLink } = props.fields || {};

  return (
    <div className="component promo">
      <div className="component-content">
        {promoIcon && (
          <div className="promo-icon">
            <Image field={promoIcon} />
          </div>
        )}
        <div className="promo-text">
          {promoText && (
            <div className="promo-text-content">
              <RichText field={promoText} />
            </div>
          )}
          {promoLink && (
            <div className="promo-link">
              <Link field={promoLink} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
