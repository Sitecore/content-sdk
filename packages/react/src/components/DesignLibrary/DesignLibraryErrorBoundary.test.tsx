/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable jsdoc/require-jsdoc */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect, use } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import proxyquire from 'proxyquire';
import { render, waitFor } from '@testing-library/react';
import { DesignLibraryPreviewError } from '@sitecore-content-sdk/core/codegen';

use(sinonChai);

const ThrowError: React.FC<{ shouldThrow?: boolean }> = ({ shouldThrow = true }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>Success</div>;
};

describe('<DesignLibraryErrorBoundary />', () => {
  let sandbox: sinon.SinonSandbox;
  let sendErrorEventStub: sinon.SinonStub;
  let DesignLibraryErrorBoundary: any;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    sendErrorEventStub = sandbox.stub();

    // Use proxyquire to inject mocked sendErrorEvent
    const module = proxyquire('./DesignLibraryErrorBoundary', {
      '@sitecore-content-sdk/core/codegen': {
        sendErrorEvent: sendErrorEventStub,
        DesignLibraryPreviewError: DesignLibraryPreviewError,
      },
    });

    DesignLibraryErrorBoundary = module.DesignLibraryErrorBoundary;
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('normal rendering', () => {
    it('should render children when no error occurs', () => {
      const { container } = render(
        <DesignLibraryErrorBoundary uid="test-uid">
          <div data-testid="child">Child Content</div>
        </DesignLibraryErrorBoundary>
      );

      expect(container.querySelector('[data-testid="child"]')).to.exist;
      expect(container.textContent).to.include('Child Content');
      expect(sendErrorEventStub).to.not.have.been.called;
    });
  });

  it('should catch errors, send error event and display error message', () => {
    const { container } = render(
      <DesignLibraryErrorBoundary uid="test-uid">
        <ThrowError />
      </DesignLibraryErrorBoundary>
    );

    expect(container.textContent).to.include('Error during component rendering');
    expect(sendErrorEventStub).to.have.been.calledOnce;
    expect(sendErrorEventStub).to.have.been.calledWith(
      'test-uid',
      sinon.match.instanceOf(Error),
      DesignLibraryPreviewError.Render
    );
    expect(sendErrorEventStub.getCall(0).args[2]).to.equal(DesignLibraryPreviewError.Render);
    expect(sendErrorEventStub.getCall(0).args[1].message).to.equal('Test error');
  });

  describe('renderKey handling', () => {
    it('should reset error state when renderKey changes', () => {
      const { container, rerender } = render(
        <DesignLibraryErrorBoundary uid="test-uid" renderKey={1}>
          <ThrowError />
        </DesignLibraryErrorBoundary>
      );

      // First render shows error
      expect(container.textContent).to.include('Error during component rendering');

      // Update with new renderKey and non-throwing component
      rerender(
        <DesignLibraryErrorBoundary uid="test-uid" renderKey={2}>
          <ThrowError shouldThrow={false} />
        </DesignLibraryErrorBoundary>
      );

      // Error should be cleared
      expect(container.textContent).to.include('Success');
    });

    it('should work without renderKey prop', () => {
      const { container } = render(
        <DesignLibraryErrorBoundary uid="test-uid">
          <div>No RenderKey</div>
        </DesignLibraryErrorBoundary>
      );

      expect(container.textContent).to.include('No RenderKey');
    });

    it('should handle renderKey from undefined to defined', () => {
      const { container, rerender } = render(
        <DesignLibraryErrorBoundary uid="test-uid">
          <ThrowError />
        </DesignLibraryErrorBoundary>
      );

      expect(container.textContent).to.include('Error during component rendering');

      rerender(
        <DesignLibraryErrorBoundary uid="test-uid" renderKey={1}>
          <ThrowError shouldThrow={false} />
        </DesignLibraryErrorBoundary>
      );

      // Error should be cleared when renderKey is added
      expect(container.textContent).to.include('Success');
    });

    it('should increment renderKey to reset error multiple times', () => {
      const { container, rerender } = render(
        <DesignLibraryErrorBoundary uid="test-uid" renderKey={1}>
          <ThrowError />
        </DesignLibraryErrorBoundary>
      );

      expect(container.textContent).to.include('Error during component rendering');

      // First reset
      rerender(
        <DesignLibraryErrorBoundary uid="test-uid" renderKey={2}>
          <ThrowError shouldThrow={false} />
        </DesignLibraryErrorBoundary>
      );
      expect(container.textContent).to.include('Success');

      // Trigger error again
      rerender(
        <DesignLibraryErrorBoundary uid="test-uid" renderKey={2}>
          <ThrowError />
        </DesignLibraryErrorBoundary>
      );
      expect(container.textContent).to.include('Error during component rendering');

      // Second reset
      rerender(
        <DesignLibraryErrorBoundary uid="test-uid" renderKey={3}>
          <ThrowError shouldThrow={false} />
        </DesignLibraryErrorBoundary>
      );
      expect(container.textContent).to.include('Success');
    });
  });

  it('should handle async errors in Suspense', async () => {
    const delay = (timeout, promise?) => {
      return new Promise((resolve) => {
        setTimeout(resolve, timeout);
      }).then(() => promise);
    };

    const AsyncComponent = React.lazy(() => delay(500, ThrowError));

    const { container } = render(
      <DesignLibraryErrorBoundary uid="test-uid">
        <AsyncComponent />
      </DesignLibraryErrorBoundary>
    );

    await waitFor(
      () => {
        expect(container.textContent).to.include('Error during component rendering');
        expect(sendErrorEventStub).to.have.been.calledOnce;
      },
      { timeout: 1000 }
    );
  });
});
