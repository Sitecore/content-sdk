﻿/* eslint-disable no-unused-expressions */
/* eslint-disable react/prop-types */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { fireEvent, render } from '@testing-library/react';
import { ComponentLibraryLayout } from './ComponentLibraryLayout';
import { getTestLayoutData } from '../test-data/component-editing-data';
import { ComponentFactory } from './sharedTypes';
import { SitecoreContext } from './SitecoreContext';
import { RichText } from './RichText';
import { Text } from './Text';
import { Placeholder } from '..';
import {
  ComponentLibraryStatus,
  ComponentUpdateEventArgs,
  getComponentLibraryStatusEvent,
} from '@sitecore-content-sdk/core/editing';

describe('<ComponentLibraryLayout />', () => {
  const postMessageSpy = sinon.spy(global.window, 'postMessage');

  const componentFactory: ComponentFactory = (componentName: string) => {
    const components = new Map<string, React.FC>();

    const ContentBlock: React.FC<{
      [prop: string]: unknown;
      fields?: { content: { value: string }; heading: { value: string } };
    }> = (props) => (
      <div className="test">
        <RichText field={props.fields?.content} />
        <Placeholder name="inner" rendering={props.rendering} />
      </div>
    );

    const InnerBlock: React.FC<{
      [prop: string]: unknown;
      fields?: { text: { value: string } };
    }> = (props) => (
      <div className="inner">
        <Text field={props.fields?.text} />
      </div>
    );

    components.set('ContentBlock', ContentBlock);
    components.set('InnerBlock', InnerBlock);

    return components.get(componentName) || null;
  };

  // eslint-disable-next-line jsdoc/require-jsdoc
  async function sendUpdateEvent(
    eventDataDetails: ComponentUpdateEventArgs['details']
  ): Promise<void> {
    // jsdom performs postMessage without origin. We work around, ugly (https://github.com/jsdom/jsdom/issues/2745)
    // jsdom also doesn't consider `new MessageEvent()` to be of class Event - so we go very much around to get it working
    const updateEvent = document.createEvent('Event');
    const updateEventData: ComponentUpdateEventArgs = {
      name: 'component:update',
      details: eventDataDetails,
    };
    updateEvent.initEvent('message', false, true);
    (updateEvent as any).origin = window.location.origin;
    (updateEvent as any).data = updateEventData;
    await fireEvent(window, updateEvent);
  }

  it('should render', () => {
    const basicPage = getTestLayoutData();
    // don't wrap the content in divs
    const rendered = render(
      <SitecoreContext componentFactory={componentFactory}>
        <ComponentLibraryLayout {...basicPage.layoutData} />
      </SitecoreContext>,
      { container: document.body }
    );
    expect(rendered.baseElement.innerHTML).to.equal(
      [
        '<main><div id="editing-component">',
        '<div class="test"><div>',
        '<p>This is a live set of examples of how to use JSS</p>\n',
        '</div></div></div></main>',
      ].join('')
    );
  });

  it('should render component with placeholders', () => {
    const placeholderPage = getTestLayoutData(true);
    const rendered = render(
      <SitecoreContext componentFactory={componentFactory} layoutData={placeholderPage.layoutData}>
        <ComponentLibraryLayout {...placeholderPage.layoutData} />
      </SitecoreContext>,
      { container: document.body }
    );

    expect(rendered.baseElement.innerHTML).to.equal(
      [
        '<main><div id="editing-component">',
        '<div class="test"><div>',
        '<p>This is a live set of examples of how to use JSS</p>\n',
        '</div>',
        '<div class="inner">',
        'Its an inner component',
        '</div></div></div>',
        '</main>',
      ].join('')
    );
  });

  it('should fire component:ready event', () => {
    const basicPage = getTestLayoutData();
    const expectedReadyMessage = getComponentLibraryStatusEvent(
      ComponentLibraryStatus.READY,
      'test-content'
    );
    const rendered = render(
      <SitecoreContext componentFactory={componentFactory} layoutData={basicPage.layoutData}>
        <ComponentLibraryLayout {...basicPage.layoutData} />
      </SitecoreContext>,
      { container: document.body }
    );

    expect(rendered.baseElement.innerHTML).to.equal(
      [
        '<main><div id="editing-component">',
        '<div class="test"><div>',
        '<p>This is a live set of examples of how to use JSS</p>\n',
        '</div></div></div></main>',
      ].join('')
    );

    expect(
      postMessageSpy
        .getCalls()
        .some((call) => JSON.stringify(call.args[0]) === JSON.stringify(expectedReadyMessage))
    ).to.be.true;
  });

  it('should update root component', async () => {
    const basicPage = getTestLayoutData();
    const rendered = render(
      <SitecoreContext componentFactory={componentFactory} layoutData={basicPage.layoutData}>
        <ComponentLibraryLayout {...basicPage.layoutData} />
      </SitecoreContext>,
      { container: document.body }
    );

    expect(rendered.baseElement.innerHTML).to.equal(
      [
        '<main><div id="editing-component">',
        '<div class="test"><div>',
        '<p>This is a live set of examples of how to use JSS</p>\n',
        '</div></div></div></main>',
      ].join('')
    );

    await sendUpdateEvent({
      uid: 'test-content',
      fields: { content: { value: 'new content!' } },
    });

    expect(rendered.baseElement.innerHTML).to.equal(
      [
        '<main><div id="editing-component">',
        '<div class="test"><div>',
        'new content!',
        '</div></div></div></main>',
      ].join('')
    );
  });

  it('should update nested component', async () => {
    const basicPage = getTestLayoutData();
    const placeholderPage = getTestLayoutData(true);
    const rendered = render(
      <SitecoreContext componentFactory={componentFactory} layoutData={basicPage.layoutData}>
        <ComponentLibraryLayout {...placeholderPage.layoutData} />
      </SitecoreContext>,
      { container: document.body }
    );
    expect(rendered.baseElement.innerHTML).to.equal(
      [
        '<main><div id="editing-component">',
        '<div class="test"><div>',
        '<p>This is a live set of examples of how to use JSS</p>\n',
        '</div>',
        '<div class="inner">',
        'Its an inner component',
        '</div></div></div>',
        '</main>',
      ].join('')
    );

    await sendUpdateEvent({
      uid: 'test-inner',
      fields: { text: { value: 'new inner content!' } },
    });

    expect(rendered.baseElement.innerHTML).to.equal(
      [
        '<main><div id="editing-component">',
        '<div class="test"><div>',
        '<p>This is a live set of examples of how to use JSS</p>\n',
        '</div>',
        '<div class="inner">',
        'new inner content!',
        '</div></div></div>',
        '</main>',
      ].join('')
    );
  });

  it('should send render event when component is updated', async () => {
    const basicPage = getTestLayoutData();
    const rendered = render(
      <SitecoreContext componentFactory={componentFactory}>
        <ComponentLibraryLayout {...basicPage.layoutData} />
      </SitecoreContext>
    );

    await sendUpdateEvent({
      uid: 'test-content',
      fields: { content: { value: 'new content!' } },
    });

    expect(
      postMessageSpy
        .getCalls()
        .some((call) =>
          JSON.stringify(call.args[0]).includes(
            JSON.stringify(
              getComponentLibraryStatusEvent(ComponentLibraryStatus.RENDERED, 'test-content')
            )
          )
        )
    ).to.be.true;
  });
});
