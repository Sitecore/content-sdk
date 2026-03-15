'use client';
import React, { Suspense } from 'react';
import { DesignLibraryPreviewError, sendErrorEvent } from '@sitecore-content-sdk/content/codegen';

/**
 * Props for the DesignLibraryErrorBoundary component.
 * @property {string} uid - The unique identifier of the component being rendered.
 * @property {React.ReactNode} children - The child components to render within the error boundary.
 * @property {number} [renderKey] - An optional key to trigger re-rendering of the error boundary when changed.
 * @internal
 */
type DesignLibraryErrorBoundaryProps = {
  uid: string;
  children: React.ReactNode;
  renderKey?: number;
};

/**
 * Error boundary for the Design Library component.
 * Catches errors during rendering and sends them to the Design Library
 * @param {DesignLibraryErrorBoundaryProps} props - The props for the error boundary, including the component UID and children to render.
 * @internal
 */
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
