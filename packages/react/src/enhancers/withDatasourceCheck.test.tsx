/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import {
  withDatasourceCheck,
  WithDatasourceCheckProps,
  Page,
  PageMode,
} from '../enhancers/withDatasourceCheck';

// Helper to create the Page object state for tests
const mockPage = (overrides?: Partial<PageMode>): Page => {
  return {
    mode: {
      isNormal: false,
      isPreview: false,
      isEditing: false,
      isDesignLibrary: false,
      ...overrides,
    },
  };
};

describe('withDatasourceCheck', () => {
  const TestComponent: React.FC<WithDatasourceCheckProps> = (props: WithDatasourceCheckProps) => {
    return (
      <div>
        <h2>{props.rendering.componentName}</h2>
        <p>{props.rendering.dataSource}</p>
      </div>
    );
  };

  it('should return null if datasource missing in normal mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '',
      },
      page: mockPage({ isNormal: true }),
    } as WithDatasourceCheckProps;

    const wrapper = render(<TestComponentWithDatasourceCheck {...props} />);

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should return null if rendering missing in normal mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    // @ts-ignore - simulating missing props
    const props = {
      page: mockPage({ isNormal: true }),
    } as WithDatasourceCheckProps;

    const wrapper = render(<TestComponentWithDatasourceCheck {...props} />);

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should return default error component if datasource missing in editing mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '',
      },
      page: mockPage({ isEditing: true }),
    } as WithDatasourceCheckProps;

    const wrapper = render(<TestComponentWithDatasourceCheck {...props} />);

    expect(wrapper.container.querySelectorAll('div.sc-jss-editing-error')).to.have.length(1);
  });

  it('should return custom error component if specified', () => {
    const CustomEditingError = () => <div>Better than yours</div>;
    const TestComponentWithDatasourceCheck = withDatasourceCheck({
      editingErrorComponent: CustomEditingError,
    })(TestComponent);

    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '',
      },
      page: mockPage({ isEditing: true }),
    } as WithDatasourceCheckProps;

    const wrapper = render(<TestComponentWithDatasourceCheck {...props} />);

    expect(wrapper.container.innerHTML).to.contain('Better than yours');
  });

  it('should return wrapped component if rendered in DesignLibrary', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '',
      },
      page: mockPage({ isDesignLibrary: true }),
    } as WithDatasourceCheckProps;

    const wrapper = render(<TestComponentWithDatasourceCheck {...props} />);

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
  });

  it('should return wrapped component if datasource present in normal mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
      },
      page: mockPage({ isNormal: true }),
    } as WithDatasourceCheckProps;

    const wrapper = render(<TestComponentWithDatasourceCheck {...props} />);

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
    expect(wrapper.container.innerHTML).to.contain(props.rendering.dataSource);
  });

  it('should return wrapped component if datasource present in editing mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
      },
      page: mockPage({ isEditing: true }),
    } as WithDatasourceCheckProps;

    const wrapper = render(<TestComponentWithDatasourceCheck {...props} />);

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
    expect(wrapper.container.innerHTML).to.contain(props.rendering.dataSource);
  });
});
