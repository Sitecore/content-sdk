import React, { JSX, Suspense } from 'react';
import { Field, RichText as ContentSdkRichText } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

interface Fields {
  Text: Field<string>;
}

export type RichTextProps = ComponentProps & {
  fields: Fields;
};

const MyComponent = async ({ componentId }: { componentId: string | undefined }) => {
  // Random delay between 2-4 seconds
  const randomDelay = Math.random() * 2000 + 2000; // 2000ms to 4000ms
  await new Promise((resolve) => setTimeout(resolve, randomDelay));
  // Fetch random number from API
  const response = await fetch(
    `https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new&id=${componentId}`,
    { cache: 'no-store' }
  );
  const randomNumber = await response.text();
  console.log('Response received:', randomNumber, componentId);
  return <div>{randomNumber.trim()}</div>;
};

export const Default = ({ params, fields, rendering }: RichTextProps): JSX.Element => {
  const { RenderingIdentifier, styles } = params;

  return (
    <div className={`component rich-text ${styles}`} id={RenderingIdentifier}>
      <div className="component-content">
        {fields ? (
          <ContentSdkRichText field={fields.Text} />
        ) : (
          <span className="is-empty-hint">Rich text</span>
        )}
        <Suspense fallback={<div>Loading...</div>}>
          <MyComponent componentId={rendering.uid} />
        </Suspense>
      </div>
    </div>
  );
};
