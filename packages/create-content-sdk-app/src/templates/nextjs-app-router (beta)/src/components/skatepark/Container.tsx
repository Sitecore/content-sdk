import React from 'react';
import {
  ComponentParams,
  ComponentRendering,
  Page,
  NextjsContentSdkComponent,
} from '@sitecore-content-sdk/nextjs';
import AppPlaceholder from 'components/content-sdk/Placeholder';

type ContainerProps = {
  rendering: ComponentRendering & { params: ComponentParams };
  params: ComponentParams;
  page: Page;
  componentMap: Map<string, NextjsContentSdkComponent>;
};

/**
 * Container component for grouping other components with optional background image.
 * Supports dynamic placeholders for flexible content placement.
 */
export const Container = (props: ContainerProps) => {
  const { params, rendering, page, componentMap } = props;
  const backgroundImage = params?.backgroundImage as string | undefined;
  const dynamicPlaceholderId = params?.dynamicPlaceholderId as string | undefined;

  const placeholderKey = dynamicPlaceholderId
    ? `container-${dynamicPlaceholderId}`
    : 'container-default';

  const backgroundStyle: React.CSSProperties = backgroundImage
    ? { backgroundImage: `url('${backgroundImage}')` }
    : {};

  return (
    <div className="component container">
      <div className="component-content" style={backgroundStyle}>
        <div className="container-inner">
          <AppPlaceholder
            name={placeholderKey}
            rendering={rendering}
            page={page}
            componentMap={componentMap}
          />
        </div>
      </div>
    </div>
  );
};
