import { render, waitFor } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import { SitecoreProvider } from './SitecoreProvider';
import { Form, mockFormModule } from './Form';
import sinon from 'sinon';

describe('Form', () => {
  const ctx = {
    api: {
      edge: {
        contextId: 'server-id',
        clientContextId: 'client-id',
        edgeUrl: 'edge-url',
      },
    },
    layoutData: {
      normal: { sitecore: { context: { pageEditing: false } } },
      editing: { sitecore: { context: { pageEditing: true } } },
    },
  };

  const rendering = {
    uid: '123',
    params: {
      FormId: '456',
      styles: 'form-class',
      RenderingIdentifier: 'form-id',
    },
  };

  it('renders form using clientContextId when both IDs are present', async () => {
    const loadFormSpy = sinon.spy((edgeId: string, formId: string, edgeUrl?: string) => {
      expect(edgeId).to.equal('client-id');
      expect(formId).to.equal('456');
      expect(edgeUrl).to.equal('edge-url');

      return Promise.resolve('<form id="test-form"><script>console.log(1);</script></form>');
    });

    const subscribeSpy = sinon.spy();
    const execSpy = sinon.spy();

    mockFormModule({
      loadForm: loadFormSpy,
      subscribeToFormSubmitEvent: subscribeSpy,
      executeScriptElements: execSpy,
    });

    const rendered = await render(
      <SitecoreProvider api={ctx.api} layoutData={ctx.layoutData.normal}>
        <Form rendering={rendering} params={rendering.params} />
      </SitecoreProvider>,
      { container: document.body }
    );

    await waitFor(() => {
      expect(loadFormSpy.calledOnce).to.be.true;
      expect(subscribeSpy.calledOnce).to.be.true;
      expect(execSpy.calledOnce).to.be.true;
      expect(rendered.container.innerHTML).to.equal(
        '<div class="form-class" id="form-id">' +
          '<form id="test-form"><script>console.log(1);</script></form></div>'
      );
    });
  });

  it('does not load form when clientContextId is missing', async () => {
    const apiNoClientId = {
      edge: {
        contextId: 'server-only',
        edgeUrl: 'edge-url',
      },
    };

    const loadFormSpy = sinon.spy(() => {
      return Promise.resolve('<form></form>');
    });

    mockFormModule({
      loadForm: loadFormSpy,
      subscribeToFormSubmitEvent: sinon.spy(),
      executeScriptElements: sinon.spy(),
    });

    const rendered = await render(
      <SitecoreProvider api={apiNoClientId} layoutData={ctx.layoutData.normal}>
        <Form rendering={rendering} params={rendering.params} />
      </SitecoreProvider>
    );

    await waitFor(() => {
      expect(loadFormSpy.notCalled).to.be.true;
      expect(rendered.container.innerHTML).to.equal('<div class="form-class" id="form-id"></div>');
    });
  });

  it('renders form in edit mode (scripts executed, no submit subscription)', async () => {
    const loadFormSpy = sinon
      .stub()
      .resolves('<form id="test-form"><script>console.log(1);</script></form>');
    const subscribeSpy = sinon.spy();
    const execSpy = sinon.spy();

    mockFormModule({
      loadForm: loadFormSpy,
      subscribeToFormSubmitEvent: subscribeSpy,
      executeScriptElements: execSpy,
    });

    const rendered = await render(
      <SitecoreProvider api={ctx.api} layoutData={ctx.layoutData.editing}>
        <Form rendering={rendering} params={rendering.params} />
      </SitecoreProvider>
    );

    await waitFor(() => {
      expect(loadFormSpy.calledOnce).to.be.true;
      expect(subscribeSpy.notCalled).to.be.true;
      expect(execSpy.calledOnce).to.be.true;

      expect(rendered.container.innerHTML).to.contain('<form id="test-form">');
    });
  });

  it('renders empty component on load failure (non-edit mode)', async () => {
    mockFormModule({
      loadForm: sinon.stub().rejects(),
      subscribeToFormSubmitEvent: sinon.spy(),
      executeScriptElements: sinon.spy(),
    });

    const rendered = await render(
      <SitecoreProvider api={ctx.api} layoutData={ctx.layoutData.normal}>
        <Form rendering={rendering} params={rendering.params} />
      </SitecoreProvider>
    );

    await waitFor(() => {
      expect(rendered.container.innerHTML).to.equal('<div class="form-class" id="form-id"></div>');
    });
  });

  it('renders edit-mode error placeholder on load failure', async () => {
    mockFormModule({
      loadForm: sinon.stub().rejects(),
      subscribeToFormSubmitEvent: sinon.spy(),
      executeScriptElements: sinon.spy(),
    });

    const rendered = await render(
      <SitecoreProvider api={ctx.api} layoutData={ctx.layoutData.editing}>
        <Form rendering={rendering} params={rendering.params} />
      </SitecoreProvider>,
      { container: document.body }
    );

    await waitFor(() => {
      rendered.rerender(
        <SitecoreProvider api={ctx.api} layoutData={ctx.layoutData.editing}>
          <Form rendering={rendering} params={rendering.params} />
        </SitecoreProvider>
      );

      expect(rendered.baseElement.innerHTML).to.equal(
        '<div class="sc-content-sdk-placeholder-error">There was a problem loading this section</div>'
      );
    });
  });
});
