'use client';

import React, { JSX, useState } from 'react';
import { ComponentProps } from 'lib/component-props';

interface ContainerProps extends ComponentProps {
  params: ComponentProps['params'] & {
    BackgroundImage?: string;
    DynamicPlaceholderId: string;
  };
  placeholders: Record<string, React.ReactNode>;
}

const Container = ({ params, placeholders }: ContainerProps): JSX.Element => {
  const { styles, RenderingIdentifier: id, BackgroundImage: backgroundImage } = params;
  const phKey = `container-{*}`;
  const [renderKey, setRenderKey] = useState(0);

  // Extract the mediaurl from rendering parameters
  const mediaUrlPattern = new RegExp(/mediaurl=\"([^"]*)\"/, 'i');

  let backgroundStyle: { [key: string]: string } = {};

  if (backgroundImage && backgroundImage.match(mediaUrlPattern)) {
    const mediaUrl = backgroundImage.match(mediaUrlPattern)?.[1] || '';

    backgroundStyle = {
      backgroundImage: `url('${mediaUrl}')`,
    };
  }

  return (
    <div key={renderKey} className={`component container-default ${styles}`} id={id}>
      <button onClick={() => setRenderKey(renderKey + 1)}>Render Key: {renderKey}</button>
      <p>Client Container</p>
      <div className="component-content" style={backgroundStyle}>
        <div className="row">{placeholders[phKey]}</div>
      </div>
    </div>
  );
};

export const Default = (props: ContainerProps): JSX.Element => {
  const styles = props.params?.styles?.split(' ');

  return styles?.includes('container') ? (
    <div className="container-wrapper">
      <Container {...props} />
    </div>
  ) : (
    <Container {...props} />
  );
};
