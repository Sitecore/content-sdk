/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { withDatasourceCheck, WithDatasourceCheckProps } from '../enhancers/withDatasourceCheck';
import {
  SitecoreProviderReactContext,
  SitecoreProviderState,
} from '../components/SitecoreProvider';
import { Page } from '@sitecore-content-sdk/content/client';
import { LayoutServicePageState } from '@sitecore-content-sdk/content/layout';

type PageModeOverrides = {
  isEditing?: boolean;
  isDesignLibrary?: boolean;
};

const createPage = ({
  isEditing = false,
  isDesignLibrary = false,
}: PageModeOverrides = {}): Page => {
  return {
    locale: 'en',
    layout: {
      sitecore: {
        context: {},
        route: null,
      },
    },
    mode: {
      name: isEditing ? LayoutServicePageState.Edit : LayoutServicePageState.Normal,
      isNormal: !isEditing && !isDesignLibrary,
      isPreview: false,
      isEditing,
      isDesignLibrary,
      designLibrary: {
        isVariantGeneration: false,
      },
    },
  };
};

/**
 * Renders the component with a `page` prop built from `pageMode`.
 * @param {React.ComponentType<WithDatasourceCheckProps>} Component component to render
 * @param {WithDatasourceCheckProps} props component props
 * @param {PageModeOverrides | null} [pageMode] page mode flags; `null` omits `page`
 * @returns {ReturnType<typeof render>} render result
 */
const renderChecked = (
  Component: React.ComponentType<WithDatasourceCheckProps>,
  props: WithDatasourceCheckProps,
  pageMode?: PageModeOverrides | null
) => {
  const page = pageMode === null ? undefined : createPage(pageMode);
  return render(<Component {...props} page={page} />);
};

/**
 * Renders the component without a `page` prop, inside a `SitecoreProvider` context built from `pageMode`.
 * @param {React.ComponentType<WithDatasourceCheckProps>} Component component to render
 * @param {WithDatasourceCheckProps} props component props
 * @param {PageModeOverrides} [pageMode] page mode flags for the context page
 * @returns {ReturnType<typeof render>} render result
 */
const renderWithContext = (
  Component: React.ComponentType<WithDatasourceCheckProps>,
  props: WithDatasourceCheckProps,
  pageMode?: PageModeOverrides
) => {
  const context = {
    page: createPage(pageMode),
    setPage: () => {},
  } as SitecoreProviderState;

  return render(
    <SitecoreProviderReactContext.Provider value={context}>
      <Component {...props} />
    </SitecoreProviderReactContext.Provider>
  );
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

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props);

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should return null if no datasource is configured on the rendering', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
      },
    };

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props);

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should return null if rendering missing in normal mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {} as WithDatasourceCheckProps;

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props);

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

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props, { isEditing: true });

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

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props, { isEditing: true });

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

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props, {
      isDesignLibrary: true,
    });

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

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props);

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

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props, { isEditing: true });

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
    expect(wrapper.container.innerHTML).to.contain(props.rendering.dataSource);
  });

  it('should return wrapped component when isContentResolved is true', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
        isContentResolved: true,
      },
    };

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props);

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
    expect(wrapper.container.innerHTML).to.contain(props.rendering.dataSource);
  });

  it('should return wrapped component when isContentResolved is true in editing mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
        isContentResolved: true,
      },
    };

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props, { isEditing: true });

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
    expect(wrapper.container.innerHTML).to.contain(props.rendering.dataSource);
  });

  it('should return null when isContentResolved is false in normal mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
        isContentResolved: false,
      },
    };

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props);

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should return default error component when isContentResolved is false in editing mode', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
        isContentResolved: false,
      },
    };

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props, { isEditing: true });

    expect(wrapper.container.querySelectorAll('div.sc-jss-editing-error')).to.have.length(1);
  });

  it('should not render when the datasource item was deleted and isContentResolved is false', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{DELETED-DATASOURCE-ID}',
        isContentResolved: false,
      },
    };

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props);

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should not render when the datasource item was archived and isContentResolved is false', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{ARCHIVED-DATASOURCE-ID}',
        isContentResolved: false,
      },
    };

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props);

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should preserve existing missing-datasource behavior when isContentResolved is true', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '',
        isContentResolved: true,
      },
    };

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props);

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should preserve existing behavior when isContentResolved is absent', () => {
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

    const rendered = renderChecked(TestComponentWithDatasourceCheck, propsWithDatasource);
    const hidden = renderChecked(TestComponentWithDatasourceCheck, propsWithoutDatasource);

    expect(rendered.container.innerHTML).to.contain(propsWithDatasource.rendering.componentName);
    expect(hidden.container.innerHTML).to.be.empty;
  });

  it('should evaluate nested placeholder renderings independently', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const nestedChild = {
      componentName: 'ChildComponent',
      dataSource: '{CHILD-DATASOURCE-ID}',
      isContentResolved: false,
    };
    const parentRendering = {
      componentName: 'ParentComponent',
      dataSource: '{PARENT-DATASOURCE-ID}',
      isContentResolved: true,
      placeholders: {
        nested: [nestedChild],
      },
    };

    const parentWrapper = renderChecked(TestComponentWithDatasourceCheck, {
      rendering: parentRendering,
    });
    const childWrapper = renderChecked(TestComponentWithDatasourceCheck, {
      rendering: nestedChild,
    });

    expect(parentWrapper.container.innerHTML).to.contain(parentRendering.componentName);
    expect(childWrapper.container.innerHTML).to.be.empty;
  });

  it('should return wrapped component in DesignLibrary when isContentResolved is false', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
        isContentResolved: false,
      },
    };

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props, {
      isDesignLibrary: true,
    });

    expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
  });

  describe('when page is omitted', () => {
    const missingDatasourceProps = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '',
      },
    };

    it('should hide a missing datasource without SitecoreProvider', () => {
      const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);

      const wrapper = renderChecked(TestComponentWithDatasourceCheck, missingDatasourceProps, null);

      expect(wrapper.container.innerHTML).to.be.empty;
    });

    it('should render the component when the datasource is valid', () => {
      const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
      const props = {
        rendering: {
          componentName: 'TestComponent',
          dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
        },
      };

      const wrapper = renderChecked(TestComponentWithDatasourceCheck, props, null);

      expect(wrapper.container.innerHTML).to.contain(props.rendering.componentName);
    });

    it('should return null if datasource missing in normal mode from context', () => {
      const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);

      const wrapper = renderWithContext(TestComponentWithDatasourceCheck, missingDatasourceProps);

      expect(wrapper.container.innerHTML).to.be.empty;
    });

    it('should return default error component if datasource missing in editing mode from context', () => {
      const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);

      const wrapper = renderWithContext(TestComponentWithDatasourceCheck, missingDatasourceProps, {
        isEditing: true,
      });

      expect(wrapper.container.querySelectorAll('div.sc-jss-editing-error')).to.have.length(1);
    });

    it('should return custom error component in editing mode from context', () => {
      const CustomEditingError = () => <div>Better than yours</div>;
      const TestComponentWithDatasourceCheck = withDatasourceCheck({
        editingErrorComponent: CustomEditingError,
      })(TestComponent);

      const wrapper = renderWithContext(TestComponentWithDatasourceCheck, missingDatasourceProps, {
        isEditing: true,
      });

      expect(wrapper.container.innerHTML).to.contain('Better than yours');
    });

    it('should return wrapped component if rendered in DesignLibrary from context', () => {
      const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);

      const wrapper = renderWithContext(TestComponentWithDatasourceCheck, missingDatasourceProps, {
        isDesignLibrary: true,
      });

      expect(wrapper.container.innerHTML).to.contain(
        missingDatasourceProps.rendering.componentName
      );
    });

    it('should return default error component when isContentResolved is false in editing mode from context', () => {
      const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
      const props = {
        rendering: {
          componentName: 'TestComponent',
          dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
          isContentResolved: false,
        },
      };

      const wrapper = renderWithContext(TestComponentWithDatasourceCheck, props, {
        isEditing: true,
      });

      expect(wrapper.container.querySelectorAll('div.sc-jss-editing-error')).to.have.length(1);
    });
  });

  it('should read page mode from props and ignore SitecoreProvider context', () => {
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(TestComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '',
      },
    };
    const context = {
      page: createPage({ isEditing: true }),
      setPage: () => {},
    } as SitecoreProviderState;

    const wrapper = render(
      <SitecoreProviderReactContext.Provider value={context}>
        <TestComponentWithDatasourceCheck {...props} page={createPage()} />
      </SitecoreProviderReactContext.Provider>
    );

    expect(wrapper.container.innerHTML).to.be.empty;
  });

  it('should pass page through to the wrapped component', () => {
    const PageAwareComponent = (props: WithDatasourceCheckProps) => <p>{props.page?.locale}</p>;
    const TestComponentWithDatasourceCheck = withDatasourceCheck()(PageAwareComponent);
    const props = {
      rendering: {
        componentName: 'TestComponent',
        dataSource: '{CACDB205-2386-4271-9F05-AE20AAC2A39E}',
      },
    };

    const wrapper = renderChecked(TestComponentWithDatasourceCheck, props);

    expect(wrapper.container.innerHTML).to.equal('<p>en</p>');
  });
});
