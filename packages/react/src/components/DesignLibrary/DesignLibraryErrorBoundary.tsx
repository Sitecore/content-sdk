'use client';
import React, { Suspense } from 'react';
import { DesignLibraryPreviewError, sendErrorEvent } from '@sitecore-content-sdk/core/codegen';

type DesignLibraryErrorBoundaryProps = {
  uid: string;
  children: React.ReactNode;
  renderKey?: number;
};

export class DesignLibraryErrorBoundary extends React.Component<DesignLibraryErrorBoundaryProps> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: DesignLibraryErrorBoundaryProps) {
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
