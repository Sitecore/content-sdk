/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { render } from '@testing-library/react';

import { LinkOptimized } from './LinkOptimized';
import { LinkField, LinkFieldValue } from './Link';

describe('<LinkOptimized />', () => {
  it('should render nothing with missing field', () => {
    const field = (null as unknown) as LinkField;
    const rendered = render(<LinkOptimized field={field} />);
    expect(rendered.container.innerHTML).to.equal('');
  });

  it('should render nothing with missing value', () => {
    const field = ({} as unknown) as LinkField;
    const rendered = render(<LinkOptimized field={field} />);
    expect(rendered.container.innerHTML).to.equal('');
  });

  it('should render nothing with empty value', () => {
    const field = { value: {} } as LinkField;
    const rendered = render(<LinkOptimized field={field} />);
    expect(rendered.container.innerHTML).to.equal('');
  });

  it('should render with a value', () => {
    const field: LinkField = {
      value: {
        href: '/lorem',
        text: 'ipsum',
      },
    };
    const rendered = render(<LinkOptimized field={field} />).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain('<a href="/lorem">ipsum</a>');
  });

  it('should render with children', () => {
    const field: LinkField = {
      value: {
        href: '/lorem',
        text: 'ipsum',
      },
    };
    const rendered = render(
      <LinkOptimized field={field}>
        <span>dolor</span>
      </LinkOptimized>
    ).container.querySelector('a');

    expect(rendered?.innerHTML).to.contain('<span>dolor</span>');
  });

  it('should render with link text and children when showLinkTextWithChildrenPresent=true', () => {
    const field: LinkField = {
      value: {
        href: '/lorem',
        text: 'ipsum',
      },
    };
    const rendered = render(
      <LinkOptimized field={field} showLinkTextWithChildrenPresent={true}>
        <span>dolor</span>
      </LinkOptimized>
    ).container.querySelector('a');

    expect(rendered?.innerHTML).to.contain('ipsum');
    expect(rendered?.innerHTML).to.contain('<span>dolor</span>');
  });

  it('should render with link text when children are empty string', () => {
    const field: LinkField = {
      value: {
        href: '/lorem',
        text: 'ipsum',
      },
    };
    const rendered = render(
      <LinkOptimized field={field} showLinkTextWithChildrenPresent={true}>
        {''}
      </LinkOptimized>
    ).container.querySelector('a');

    expect(rendered?.innerHTML).to.contain('ipsum');
  });

  it('should render with href when text is not present', () => {
    const field: LinkField = {
      value: {
        href: '/lorem',
      },
    };
    const rendered = render(<LinkOptimized field={field} />).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain('<a href="/lorem">/lorem</a>');
  });

  it('should render all attributes with all provided', () => {
    const field: LinkField = {
      value: {
        href: '/lorem',
        text: 'ipsum',
        title: 'Foo',
        target: '_blank',
        class: 'bar',
      },
    };
    const rendered = render(<LinkOptimized field={field} />).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain(
      '<a href="/lorem" class="bar" title="Foo" target="_blank" rel="noopener noreferrer">ipsum</a>'
    );
  });

  it('should render with an anchor', () => {
    const field: LinkField = {
      value: {
        href: '/lorem',
        anchor: 'ipsum',
        text: 'lorem',
      },
    };
    const rendered = render(<LinkOptimized field={field} />).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain('<a href="/lorem#ipsum">lorem</a>');
  });

  it('should render anchor link value with href when anchor link type is provided', () => {
    const field: LinkField = {
      value: {
        href: '/lorem',
        anchor: 'ipsum',
        text: 'lorem',
        linktype: 'anchor',
      },
    };
    const rendered = render(<LinkOptimized field={field} />).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain('<a href="/lorem">lorem</a>');
  });

  it('should render other attributes', () => {
    const field: LinkField = {
      value: {
        href: '/lorem',
        text: 'ipsum',
      },
    };
    const rendered = render(
      <LinkOptimized field={field} id="my-link" accessKey="a" />
    ).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain('<a href="/lorem" id="my-link" accesskey="a">ipsum</a>');
  });

  it('should render when link data provided directly', () => {
    const field: LinkFieldValue = {
      href: '/lorem',
      text: 'ipsum',
    };
    const rendered = render(<LinkOptimized field={field} />).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain('<a href="/lorem">ipsum</a>');
  });

  it('should render with a querystring', () => {
    const field: LinkField = {
      value: {
        href: '/lorem',
        querystring: 'foo=bar',
        text: 'lorem',
      },
    };
    const rendered = render(<LinkOptimized field={field} />).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain('<a href="/lorem?foo=bar">lorem</a>');
  });

  it('should render with a querystring and an anchor', () => {
    const field: LinkField = {
      value: {
        href: '/lorem',
        querystring: 'foo=bar',
        anchor: 'ipsum',
        text: 'lorem',
      },
    };
    const rendered = render(<LinkOptimized field={field} />).container.querySelector('a');
    expect(rendered?.outerHTML).to.contain('<a href="/lorem?foo=bar#ipsum">lorem</a>');
  });

  describe('edit mode metadata', () => {
    const testMetadata = {
      contextItem: {
        id: '{09A07660-6834-476C-B93B-584248D3003B}',
        language: 'en',
        revision: 'a0b36ce0a7db49418edf90eb9621e145',
        version: 1,
      },
      fieldId: '{414061F4-FBB1-4591-BC37-BFFA67F745EB}',
      fieldType: 'link',
      rawValue: '/lorem',
    };

    it('should render field metadata component when metadata property is present', () => {
      const field: LinkField = {
        value: {
          href: '/lorem',
          text: 'ipsum',
        },
        metadata: testMetadata,
      };

      const rendered = render(<LinkOptimized field={field} />);

      expect(rendered.container.innerHTML).to.equal(
        [
          `<code type="text/sitecore" chrometype="field" class="scpm" kind="open">${JSON.stringify(
            testMetadata
          )}</code>`,
          '<a href="/lorem">ipsum</a>',
          '<code type="text/sitecore" chrometype="field" class="scpm" kind="close"></code>',
        ].join('')
      );
    });

    it('should render default empty field component when field value is empty in edit mode metadata', () => {
      const field = {
        value: { href: '' },
        metadata: testMetadata,
      };

      const rendered = render(<LinkOptimized field={field} />);

      expect(rendered.container.innerHTML).to.equal(
        [
          `<code type="text/sitecore" chrometype="field" class="scpm" kind="open">${JSON.stringify(
            testMetadata
          )}</code>`,
          '<span>[No text in field]</span>',
          '<code type="text/sitecore" chrometype="field" class="scpm" kind="close"></code>',
        ].join('')
      );
    });
  });
});
