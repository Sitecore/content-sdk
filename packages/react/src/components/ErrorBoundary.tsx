'use client';
import React, { ReactNode, Suspense } from 'react';
import { Page } from '@sitecore-content-sdk/content/client';
import { ComponentRendering } from '@sitecore-content-sdk/content/layout';
import { useSitecore } from './SitecoreProvider';

type ErrorComponentProps = {
  [prop: string]: unknown;
};

export type ErrorBoundaryProps = {
  children: ReactNode;
  page: Page;
  isDynamic?: boolean;
  errorComponent?: React.ComponentClass<ErrorComponentProps> | React.FC<ErrorComponentProps>;
  rendering?: ComponentRendering;
  componentLoadingMessage?: string;
  disableSuspense?: boolean;
};

/**
 * Simple error component applying basic error styling.
 * @param {object} props - Either with `message` (string) or with `children` (ReactNode), but not both.
 */
export const ErrorComponent = (
  props:
    | { message: React.ReactNode; children?: never }
    | { children: React.ReactNode; message?: never }
) => {
  return (
    <div className="sc-content-sdk-placeholder-error">
      {props.message ? props.message : props.children}
    </div>
  );
};

class ErrorBoundaryClass extends React.Component<ErrorBoundaryProps> {
  defaultErrorMessage = 'There was a problem loading this section.';
  defaultLoadingMessage = 'Loading component...';
  state: { error: Error | null } = { error: null };

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error) {
    return { error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (this.showErrorDetails()) {
      console.error(
        `An error occurred in component ${this.props.rendering?.componentName} (${this.props.rendering?.uid}): `
      );
    }

    console.error({ error, errorInfo });
  }

  isInDevMode(): boolean {
    return process.env.NODE_ENV === 'development';
  }

  showErrorDetails(): boolean {
    return this.isInDevMode() || this.props.page.mode.isEditing || this.props.page.mode.isPreview;
  }

  render() {
    if (this.state.error) {
      if (this.props.errorComponent) {
        return <this.props.errorComponent error={this.state.error} />;
      } else {
        if (this.showErrorDetails()) {
          return (
            <div>
              <ErrorComponent>
                A rendering error occurred in component{' '}
                <em>{this.props.rendering?.componentName}</em>
                <br />
                Error: <em>{this.state.error.message || JSON.stringify(this.state.error)}</em>
              </ErrorComponent>
            </div>
          );
        } else {
          return (
            <div>
              <ErrorComponent message={this.defaultErrorMessage} />
            </div>
          );
        }
      }
    }

    // do not apply suspense when suspense is disabled or when on already dynamic components
    if ((this.props.disableSuspense ?? true) || this.props.isDynamic) return this.props.children;

    return (
      <Suspense
        fallback={<h4>{this.props.componentLoadingMessage || this.defaultLoadingMessage}</h4>}
      >
        {this.props.children}
      </Suspense>
    );
  }
}

const ErrorBoundary = (props: Omit<ErrorBoundaryProps, 'page'>) => {
  const { page } = useSitecore();
  const boundaryProps = { ...props, page };
  return <ErrorBoundaryClass {...boundaryProps} />;
};

export default ErrorBoundary;
