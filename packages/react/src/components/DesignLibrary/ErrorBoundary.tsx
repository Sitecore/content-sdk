import React from 'react';
import { DesignLibraryPreviewError } from '@sitecore-content-sdk/core/codegen';
import { sendErrorEvent } from './design-library-utils';

type ErrorBoundaryProps = {
  uid: string;
  children: React.ReactNode;
  renderKey: number;
};

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
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

    return this.props.children;
  }
}
