/* eslint-disable no-unused-expressions */
import { expect } from 'chai';
import { rewriteContentInLayout } from './content-rewrite';
import { LayoutServiceData } from './models';

describe('rewriteContentInLayout', () => {
  it('should replace string source with target in all string values (type normal)', () => {
    const layout: LayoutServiceData = {
      sitecore: {
        context: {},
        route: {
          name: 'test',
          placeholders: {},
          fields: {
            image: {
              value: {
                src: 'https://edge.example.com/media/image.jpg',
              },
            },
          },
        },
      },
    };
    const result = rewriteContentInLayout(
      layout,
      'https://edge.example.com',
      'https://custom.example.com',
      { type: 'normal' }
    );
    expect(result.sitecore.route!.fields!.image.value.src).to.equal(
      'https://custom.example.com/media/image.jpg'
    );
  });

  it('should replace in rich text (HTML with img src)', () => {
    const layout: LayoutServiceData = {
      sitecore: {
        context: {},
        route: {
          name: 'test',
          placeholders: {
            main: [
              {
                componentName: 'RichText',
                fields: {
                  content: {
                    value:
                      '<p><img src="https://edge.example.com/media/inline.jpg" /> and <a href="https://edge.example.com/media/doc.pdf">link</a></p>',
                  },
                },
              },
            ],
          },
        },
      },
    };
    const result = rewriteContentInLayout(
      layout,
      /https:\/\/edge\.example\.com/gi,
      'https://cdn.example.com',
      { type: 'normal' }
    );
    expect(result.sitecore.route!.placeholders!.main[0].fields!.content.value).to.equal(
      '<p><img src="https://cdn.example.com/media/inline.jpg" /> and <a href="https://cdn.example.com/media/doc.pdf">link</a></p>'
    );
  });

  it('should replace with RegExp source', () => {
    const layout: LayoutServiceData = {
      sitecore: {
        context: {},
        route: {
          name: 'test',
          placeholders: {},
          fields: {
            link: { value: { href: 'https://edge-staging.sitecore-staging.cloud/path' } },
          },
        },
      },
    };
    const result = rewriteContentInLayout(
      layout,
      /https?:\/\/edge(-staging)?\.sitecore[^/]+/gi,
      'https://custom.example.com',
      { type: 'normal' }
    );
    expect((result.sitecore.route!.fields!.link.value as { href: string }).href).to.equal(
      'https://custom.example.com/path'
    );
  });

  it('should not mutate input layout', () => {
    const layout: LayoutServiceData = {
      sitecore: {
        context: {},
        route: {
          name: 'test',
          placeholders: {},
          fields: { url: { value: 'https://old.com/path' } },
        },
      },
    };
    const original = (layout.sitecore.route!.fields as { url: { value: string } }).url.value;
    rewriteContentInLayout(layout, 'https://old.com', 'https://new.com');
    expect((layout.sitecore.route!.fields as { url: { value: string } }).url.value).to.equal(
      original
    );
  });

  it('should default to type normal', () => {
    const layout: LayoutServiceData = {
      sitecore: {
        context: {},
        route: {
          name: 'test',
          placeholders: {},
          fields: { u: { value: 'https://a.com/xhttps://a.com/y' } },
        },
      },
    };
    const result = rewriteContentInLayout(layout, 'https://a.com', 'https://b.com');
    expect((result.sitecore.route!.fields as { u: { value: string } }).u.value).to.equal(
      'https://b.com/xhttps://b.com/y'
    );
  });

  it('should handle type prefix (string source)', () => {
    const layout: LayoutServiceData = {
      sitecore: {
        context: {},
        route: {
          name: 'test',
          placeholders: {},
          fields: {
            a: { value: 'https://edge.com/path' },
            b: { value: 'see https://edge.com/other' },
          },
        },
      },
    };
    const result = rewriteContentInLayout(
      layout,
      'https://edge.com',
      'https://custom.com',
      { type: 'prefix' }
    );
    expect((result.sitecore.route!.fields as { a: { value: string }; b: { value: string } }).a.value).to.equal(
      'https://custom.com/path'
    );
    expect((result.sitecore.route!.fields as { a: { value: string }; b: { value: string } }).b.value).to.equal(
      'see https://edge.com/other'
    );
  });

  it('should handle null route', () => {
    const layout: LayoutServiceData = {
      sitecore: { context: {}, route: null },
    };
    const result = rewriteContentInLayout(layout, 'https://old.com', 'https://new.com');
    expect(result.sitecore.route).to.be.null;
  });
});
