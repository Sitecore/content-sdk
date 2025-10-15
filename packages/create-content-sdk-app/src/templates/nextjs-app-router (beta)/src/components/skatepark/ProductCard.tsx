import React from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Image,
  Link,
  Text,
} from '@sitecore-content-sdk/nextjs';

interface Fields {
  productName: { value: string };
  productImage: {
    value: {
      src: string;
      alt: string;
    };
  };
  productDescription: { value: string };
  productPrice: { value: string };
  productLink: {
    value: {
      href: string;
      text: string;
    };
  };
}

type ProductCardProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  fields: Fields;
};

export const ProductCard = (props: ProductCardProps) => {
  const { productName, productImage, productDescription, productPrice, productLink } =
    props.fields || {};

  return (
    <div className="product-card">
      {productImage && (
        <div className="product-image">
          <Image field={productImage} />
        </div>
      )}
      <div className="product-details">
        {productName && <Text tag="h3" className="product-name" field={productName} />}
        {productDescription && (
          <Text tag="p" className="product-description" field={productDescription} />
        )}
        {productPrice && <Text tag="span" className="product-price" field={productPrice} />}
        {productLink && <Link field={productLink} className="product-link" />}
      </div>
    </div>
  );
};
