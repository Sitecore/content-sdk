/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { spy } from 'sinon';

import { withDatasourceCheck, WithDatasourceCheckProps } from '../enhancers/withDatasourceCheck';
import {
  SitecoreProviderReactContext,
  SitecoreProviderState,
} from '../components/SitecoreProvider';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';

const mockContext = (editing: boolean): SitecoreProviderState => {
  return {
    page: {
      locale: 'en',
      layout: {
        sitecore: {
          context: {},
          route: null,
        },
      },
      mode: {
        name: LayoutServicePageState.Normal,
        isNormal: false,
        isPreview: false,
        isEditing: editing,
        isDesignLibrary: false,
        designLibrary: {
          isVariantGeneration: false,
        },
      },
    },
    setPage: spy(),
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
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should return null if no datasource is configured on the rendering', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
      },
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should return null if rendering missing in normal mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {} as WithDatasourceCheckProps;

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should return default error component if datasource missing in editing mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '',
      },
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(true)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

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
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(true)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.contain('Better than yours');
  });

  it('should return wrapped component if rendered in DesignLibrary', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '',
      },
    };

    const context = mockContext(false);

    context.page.mode.isDesignLibrary = true;

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={context}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
    expect(wrapper.container.innerHTML).to.contain(props.rendering.dataSource);
  });

  it('should return wrapped component if datasource present in normal mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
      },
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

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
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(true)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
    expect(wrapper.container.innerHTML).to.contain(props.rendering.dataSource);
  });

  it('should return wrapped component if not within SitecoreProvider', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
      },
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
    expect(wrapper.container.innerHTML).to.contain(props.rendering.dataSource);
  });

  it('should return wrapped component when dataSourceResolveFailed is false', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
        dataSourceResolveFailed: false,
      },
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
    expect(wrapper.container.innerHTML).to.contain(props.rendering.dataSource);
  });

  it('should return wrapped component when dataSourceResolveFailed is false in editing mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
        dataSourceResolveFailed: false,
      },
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(true)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
    expect(wrapper.container.innerHTML).to.contain(props.rendering.dataSource);
  });

  it('should return null when dataSourceResolveFailed is true in normal mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
        dataSourceResolveFailed: true,
      },
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should return default error component when dataSourceResolveFailed is true in editing mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
        dataSourceResolveFailed: true,
      },
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(true)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.querySelectorAll('div.sc-jss-editing-error')).to.have.length(1);
  });

  it('should not render when the datasource item was deleted and dataSourceResolveFailed is true', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{DELETED-DATASOURCE-ID}',
        dataSourceResolveFailed: true,
      },
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should not render when the datasource item was archived and dataSourceResolveFailed is true', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{ARCHIVED-DATASOURCE-ID}',
        dataSourceResolveFailed: true,
      },
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should preserve existing missing-datasource behavior when dataSourceResolveFailed is false', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '',
        dataSourceResolveFailed: false,
      },
    };

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should preserve existing behavior when dataSourceResolveFailed is absent', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const propsWithDatasource = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
      },
    };
    const propsWithoutDatasource = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '',
      },
    };

    const rendered = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck {...propsWithDatasource} />
      </SitecoreProviderReactContext.Provider>
    );
    const hidden = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck {...propsWithoutDatasource} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(rendered.container.innerHTML).to.contain(propsWithDatasource.rendering.componentName);
    expect(hidden.container.innerHTML).to.be.empty;
  });

  it('should evaluate nested placeholder renderings independently', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const nestedChild = {
      componentName: 'ChildComponent',
      dataSource: '{CHILD-DATASOURCE-ID}',
      dataSourceResolveFailed: true,
    };
    const parentRendering = {
      componentName: 'ParentComponent',
      dataSource: '{PARENT-DATASOURCE-ID}',
      dataSourceResolveFailed: false,
      placeholders: {
        nested: [nestedChild],
      },
    };

    const parentWrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck rendering={parentRendering} />
      </SitecoreProviderReactContext.Provider>
    );
    const childWrapper = render(
      <SitecoreProviderReactContext.Provider value={mockContext(false)}>
        <TestComponentWithDatasourceCheck rendering={nestedChild} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(parentWrapper.container.innerHTML).to.contain(parentRendering.componentName);
    expect(childWrapper.container.innerHTML).to.be.empty;
  });

  it('should return wrapped component in DesignLibrary when dataSourceResolveFailed is true', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
        dataSourceResolveFailed: true,
      },
    };

    const context = mockContext(false);
    context.page.mode.isDesignLibrary = true;

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={context}>
        <TestComponentWithDatasourceCheck {...props} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
  });
});
