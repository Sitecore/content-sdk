import { expect } from 'chai';
import React from 'react';
import { render } from '@testing-library/react';
import proxyquire from 'proxyquire';

describe('page-params cache', () => {
  let getCachedPageParams: () => { locale: string; site: string };
  let setCachedPageParams: (pageParams: { locale: string; site: string }) => void;

  beforeEach(() => {
    const module = proxyquire('./page-params', {
      react: {
        cache: (factory: () => { locale: string; site: string }) => {
          const value = factory();
          return () => value;
        },
      },
    });

    getCachedPageParams = module.getCachedPageParams;
    setCachedPageParams = module.setCachedPageParams;
  });

  it('should return default empty page params', () => {
    expect(getCachedPageParams()).to.deep.equal({ locale: '', site: '' });
  });

  it('should return updated page params after setting new values', () => {
    setCachedPageParams({ locale: 'en', site: 'website' });
    expect(getCachedPageParams()).to.deep.equal({ locale: 'en', site: 'website' });

    setCachedPageParams({ locale: 'fr', site: 'website2' });
    expect(getCachedPageParams()).to.deep.equal({ locale: 'fr', site: 'website2' });
  });

  it('should render current page params values while rendering a component', () => {
    const PageReader = ({ locale, site }: { locale: string; site: string }) => {
      setCachedPageParams({ locale, site });
      const pageParams = getCachedPageParams();

      return (
        <div data-testid="page-params">
          {pageParams.locale}:{pageParams.site}
        </div>
      );
    };
    const result = render(<PageReader locale="en" site="website" />);

    expect(result.getByTestId('page-params').textContent).to.equal('en:website');
  });
});

