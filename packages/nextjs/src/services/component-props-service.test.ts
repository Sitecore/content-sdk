/* eslint-disable no-unused-expressions */
import { ComponentRendering } from '@sitecore-content-sdk/core/layout';
import { expect } from 'chai';
import { IncomingMessage, ServerResponse } from 'http';
import { ParsedUrlQuery } from 'querystring';
import { ComponentPropsService } from './component-props-service';
import { spy } from 'sinon';
import { ComponentMap } from '@sitecore-content-sdk/react';
import { NextjsJssComponent } from '../../types';

describe('ComponentPropsService', () => {
  const service = new ComponentPropsService();

  const rendering = (componentUid?: string, componentName?: string): ComponentRendering => ({
    uid: componentUid,
    componentName: componentName || `name${componentUid}`,
  });

  const placeholders = {
    x11ph: [
      rendering('x11'),
      {
        ...rendering('x12'),
        placeholders: {
          x12ph: [rendering('x13'), rendering('x14')],
          x13ph: [
            {
              ...rendering('x15'),
              placeholders: {
                x14ph: [
                  rendering('x16', 'MyCustomComponent'),
                  rendering('x161', 'MyCustomComponent'),
                  rendering('x17'),
                  rendering(undefined, 'MyCustomComponent'),
                ],
              },
            },
          ],
        },
      },
    ],
    x21ph: [
      rendering('x21'),
      {
        ...rendering('x22'),
        placeholders: {
          x22ph: [rendering('x23', 'MyCustomComponent')],
        },
      },
      rendering('x24'),
    ],
  };

  const layoutData = {
    sitecore: {
      context: {},
      route: {
        name: 'route1',
        placeholders,
      },
    },
  };

  const context = { locale: 'en' };

  const fetchFn = (expectedData: unknown, err?: string | { message: string }) =>
    spy(() => (err ? Promise.reject(err) : Promise.resolve(expectedData)));

  it('fetchComponentProps in SSR', async () => {
    const ssrComponentMap = new Map<string, unknown>([
      [
        'namex11',
        {
          getServerSideProps: fetchFn('x11SSRData'),
        },
      ],
      [
        'namex14',
        {
          getServerSideProps: fetchFn('x14SSRData', 'whoops'),
        },
      ],
      [
        'MyCustomComponent',
        {
          getServerSideProps: fetchFn('myCustomComponentSSRData'),
        },
      ],
      [
        'namex24',
        {
          getServerSideProps: fetchFn('x24SSRData'),
        },
      ],
    ]);

    const ssrContext = {
      req: {} as IncomingMessage & { cookies: { [key: string]: string } },
      res: {} as ServerResponse,
      query: {} as ParsedUrlQuery,
      resolvedUrl: '',
    };

    const result = await service.fetchComponentProps({
      components: (ssrComponentMap as unknown) as ComponentMap<NextjsJssComponent>,
      context: ssrContext,
      layoutData,
    });

    expect(result).to.deep.equal({
      x11: 'x11SSRData',
      x14: {
        error: 'Error during preload data for component namex14 (x14): whoops',
        componentName: 'namex14',
      },
      x16: 'myCustomComponentSSRData',
      x161: 'myCustomComponentSSRData',
      x23: 'myCustomComponentSSRData',
      x24: 'x24SSRData',
    });
  });

  it('fetchComponentProps in SSR using lazy loading module', async () => {
    const ssrComponentMap = (new Map<string, unknown>([
      [
        'namex11',
        {
          getServerSideProps: fetchFn('x11SSRData'),
        },
      ],
      [
        'namex14',
        {
          dynamicModule: async () => ({
            getServerSideProps: fetchFn('x14SSRData', 'whoops'),
          }),
        },
      ],
      [
        'MyCustomComponent',
        {
          getServerSideProps: fetchFn('myCustomComponentSSRData'),
        },
      ],
      [
        'namex24',
        {
          getServerSideProps: fetchFn('x24SSRData'),
        },
      ],
    ]) as unknown) as ComponentMap<NextjsJssComponent>;

    const ssrContext = {
      req: {} as IncomingMessage & { cookies: { [key: string]: string } },
      res: {} as ServerResponse,
      query: {} as ParsedUrlQuery,
      resolvedUrl: '',
    };

    const result = await service.fetchComponentProps({
      components: ssrComponentMap,
      context: ssrContext,
      layoutData,
    });

    expect(result).to.deep.equal({
      x11: 'x11SSRData',
      x14: {
        error: 'Error during preload data for component namex14 (x14): whoops',
        componentName: 'namex14',
      },
      x16: 'myCustomComponentSSRData',
      x161: 'myCustomComponentSSRData',
      x23: 'myCustomComponentSSRData',
      x24: 'x24SSRData',
    });
  });

  it('fetchComponentProps in SSG using lazy loading module', async () => {
    const ssgComponentMap = (new Map<string, unknown>([
      [
        'namex11',
        {
          getStaticProps: fetchFn('x11StaticData'),
        },
      ],
      [
        'namex14',
        {
          dynamicModule: async () => ({
            getStaticProps: fetchFn('x14SSRData', 'whoops'),
          }),
        },
      ],
      [
        'MyCustomComponent',
        {
          getStaticProps: fetchFn('myCustomComponentStaticData'),
        },
      ],
      [
        'namex24',
        {
          getStaticProps: fetchFn('x24StaticData'),
        },
      ],
    ]) as unknown) as ComponentMap<NextjsJssComponent>;

    const result = await service.fetchComponentProps({
      components: ssgComponentMap,
      context,
      layoutData,
    });

    expect(result).to.deep.equal({
      x11: 'x11StaticData',
      x14: {
        error: 'Error during preload data for component namex14 (x14): whoops',
        componentName: 'namex14',
      },
      x16: 'myCustomComponentStaticData',
      x161: 'myCustomComponentStaticData',
      x23: 'myCustomComponentStaticData',
      x24: 'x24StaticData',
    });
  });

  it('fetchComponentProps in SSG', async () => {
    const ssgComponentMap = (new Map<string, unknown>([
      [
        'namex11',
        {
          getStaticProps: fetchFn('x11StaticData'),
        },
      ],
      [
        'namex14',
        {
          getStaticProps: fetchFn('x14StaticData', 'whoops'),
        },
      ],
      [
        'MyCustomComponent',
        {
          getStaticProps: fetchFn('myCustomComponentStaticData'),
        },
      ],
      [
        'namex24',
        {
          getStaticProps: fetchFn('x24StaticData'),
        },
      ],
    ]) as unknown) as ComponentMap<NextjsJssComponent>;

    const result = await service.fetchComponentProps({
      components: ssgComponentMap,
      context,
      layoutData,
    });

    expect(result).to.deep.equal({
      x11: 'x11StaticData',
      x14: {
        error: 'Error during preload data for component namex14 (x14): whoops',
        componentName: 'namex14',
      },
      x16: 'myCustomComponentStaticData',
      x161: 'myCustomComponentStaticData',
      x23: 'myCustomComponentStaticData',
      x24: 'x24StaticData',
    });
  });
});
