import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import proxyquire from 'proxyquire';
import { ChildComponentProps } from '@sitecore-content-sdk/react';
import { ComponentPropsContext } from './ComponentPropsContext';

describe('Placeholder modifyComponentProps', () => {
  const initialProps: ChildComponentProps = {
    rendering: { componentName: 'ContentBlock', uid: 'content-block' },
    fields: {},
    params: {},
  };

  let Placeholder: typeof import('./Placeholder').Placeholder;
  let currentProps: ChildComponentProps;
  let result: ChildComponentProps | undefined;

  before(() => {
    ({ Placeholder } = proxyquire('./Placeholder', {
      '@sitecore-content-sdk/react': {
        Placeholder: (props: {
          modifyComponentProps: (props: ChildComponentProps) => ChildComponentProps;
        }) => {
          result = props.modifyComponentProps(currentProps);
          return null;
        },
      },
    }));
  });

  const transformProps = (
    componentProps: ChildComponentProps,
    data: Record<string, Record<string, unknown>>,
    modifyComponentProps?: (props: ChildComponentProps) => ChildComponentProps
  ) => {
    currentProps = componentProps;
    result = undefined;

    const view = render(
      <ComponentPropsContext value={data}>
        <Placeholder
          name="main"
          rendering={componentProps.rendering}
          modifyComponentProps={modifyComponentProps}
        />
      </ComponentPropsContext>
    );
    view.unmount();
    return result;
  };

  it('preserves default component data injection without a custom callback', () => {
    const result = transformProps(initialProps, { 'content-block': { theme: 'light' } });

    expect(result).to.deep.equal({ ...initialProps, theme: 'light' });
  });

  it('passes injected data to the custom callback and lets custom values win', () => {
    const result = transformProps(
      initialProps,
      { 'content-block': { theme: 'light', title: 'Original title' } },
      (props) => {
        expect(props.theme).to.equal('light');
        return { ...props, theme: 'dark' };
      }
    );

    expect(result).to.deep.equal({ ...initialProps, theme: 'dark', title: 'Original title' });
  });

  it('runs the custom callback without a rendering UID', () => {
    const propsWithoutUid = {
      ...initialProps,
      rendering: { componentName: 'ContentBlock' },
    };
    const result = transformProps(propsWithoutUid, {}, (props) => ({ ...props, theme: 'dark' }));

    expect(result).to.deep.equal({ ...propsWithoutUid, theme: 'dark' });
  });

  it('runs the custom callback when no component data matches the UID', () => {
    const result = transformProps(initialProps, {}, (props) => ({ ...props, theme: 'dark' }));

    expect(result).to.deep.equal({ ...initialProps, theme: 'dark' });
  });

  it('preserves the original props when no UID or custom callback is provided', () => {
    const propsWithoutUid = {
      ...initialProps,
      rendering: { componentName: 'ContentBlock' },
    };

    expect(transformProps(propsWithoutUid, {})).to.equal(propsWithoutUid);
  });
});
