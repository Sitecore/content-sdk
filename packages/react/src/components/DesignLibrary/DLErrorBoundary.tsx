'use client';
import React, { Suspense } from 'react';
import { DesignLibraryPreviewError } from '@sitecore-content-sdk/core/codegen';
import { sendErrorEvent } from './design-library-utils';

type DLErrorBoundaryProps = {
  uid: string;
  children: React.ReactNode;
  renderKey?: number;
};

export class DLErrorBoundary extends React.Component<DLErrorBoundaryProps> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: DLErrorBoundaryProps) {
    if (prevProps.renderKey !== this.props.renderKey) {
      this.setState({ hasError: false });
    }
  }

  componentDidCatch(error: Error) {
    sendErrorEvent(this.props.uid, error, DesignLibraryPreviewError.Render);
  }

  render() {
    if (this.state.hasError) {
      return <div>Error during component rendering</div>;
    }

    return <Suspense>{this.props.children}</Suspense>;
  }
}
