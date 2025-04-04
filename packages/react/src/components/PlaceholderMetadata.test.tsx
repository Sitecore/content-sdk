﻿import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';
import { PlaceholderMetadata } from './PlaceholderMetadata';

describe('PlaceholderMetadata', () => {
  it('renders rendering code blocks for metadataType rendering', () => {
    const children = <div className="richtext-class"></div>;

    const wrapper = render(
      <PlaceholderMetadata rendering={{ uid: '123', componentName: 'RichText' }}>
        {children}
      </PlaceholderMetadata>
    );

    expect(wrapper.container.innerHTML).to.equal(
      [
        '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="open" id="123"></code>',
        '<div class="richtext-class"></div>',
        '<code type="text/sitecore" chrometype="rendering" class="scpm" kind="close"></code>',
      ].join('')
    );
  });

  it('renders placeholder code blocks when metadataType is placeholder', () => {
    const children = <div className="richtext-mock"></div>;
    const wrapper = render(
      <PlaceholderMetadata
        rendering={{
          uid: '123',
          componentName: 'RichText',
          placeholders: { main: [] },
        }}
        placeholderName={'main'}
      >
        {children}
      </PlaceholderMetadata>
    );

    expect(wrapper.container.innerHTML).to.equal(
      [
        '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="main_123"></code>',
        '<div class="richtext-mock"></div>',
        '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
      ].join('')
    );
  });

  it('renders placeholder code blocks with DEFAULT_PLACEHOLDER_UID value when metadataType is a placeholder(root) and uid is not present', () => {
    const children = <div className="richtext-mock"></div>;
    const wrapper = render(
      <PlaceholderMetadata
        rendering={{
          componentName: 'RichText',
          placeholders: { main: [] },
        }}
        placeholderName={'main'}
      >
        {children}
      </PlaceholderMetadata>
    );

    expect(wrapper.container.innerHTML).to.equal(
      [
        '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="main_00000000-0000-0000-0000-000000000000"></code>',
        '<div class="richtext-mock"></div>',
        '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
      ].join('')
    );
  });

  it('renders placeholder blocks with rendering uid when metadataType is dynamic placeholder', () => {
    const children = <div className="richtext-mock"></div>;
    const wrapper = render(
      <PlaceholderMetadata
        rendering={{
          uid: 'renderinguid',
          componentName: 'RichText',
          placeholders: { 'main-{*}': [] },
        }}
        placeholderName={'main-1'}
      >
        {children}
      </PlaceholderMetadata>
    );

    expect(wrapper.container.innerHTML).to.equal(
      [
        '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="main-{*}_renderinguid"></code>',
        '<div class="richtext-mock"></div>',
        '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
      ].join('')
    );
  });

  it('renders placeholder blocks with DEFAULT_PLACEHOLDER_UID value when metadataType is dynamic placeholder and uid is not present', () => {
    const children = <div className="richtext-mock"></div>;
    const wrapper = render(
      <PlaceholderMetadata
        rendering={{
          componentName: 'RichText',
          placeholders: { 'main-{*}': [] },
        }}
        placeholderName={'main-1'}
      >
        {children}
      </PlaceholderMetadata>
    );

    expect(wrapper.container.innerHTML).to.equal(
      [
        '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="main-{*}_00000000-0000-0000-0000-000000000000"></code>',
        '<div class="richtext-mock"></div>',
        '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
      ].join('')
    );
  });

  it('renders placeholder code blocks when metadataType is double digit dynamic placeholder', () => {
    const children = <div className="richtext-mock"></div>;
    const wrapper = render(
      <PlaceholderMetadata
        rendering={{
          uid: 'renderinguid',
          componentName: 'RichText',
          placeholders: { 'main-1-{*}': [] },
        }}
        placeholderName={'main-1-1'}
      >
        {children}
      </PlaceholderMetadata>
    );

    expect(wrapper.container.innerHTML).to.equal(
      [
        '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="open" id="main-1-{*}_renderinguid"></code>',
        '<div class="richtext-mock"></div>',
        '<code type="text/sitecore" chrometype="placeholder" class="scpm" kind="close"></code>',
      ].join('')
    );
  });
});
