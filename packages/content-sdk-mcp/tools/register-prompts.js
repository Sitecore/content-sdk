export function registerPrompts(server) {
  if (typeof server.prompt !== 'function') return;

  server.prompt({
    name: 'summarizeContent',
    description: 'Summarize a Sitecore content item JSON',
    inputSchema: {
      type: 'object',
      properties: { content: { type: 'string' } },
      required: ['content'],
    },
    messages: [
      {
        role: 'user',
        content: [{ type: 'text', text: 'Summarize this content item:\n\n{{content}}' }],
      },
    ],
  });

  server.prompt({
    name: 'seoDescription',
    description: 'Generate an SEO meta description for a content item',
    inputSchema: {
      type: 'object',
      properties: { content: { type: 'string' } },
      required: ['content'],
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Create an SEO-friendly 150-160 char meta description for:\n\n{{content}}',
          },
        ],
      },
    ],
  });

  server.prompt({
    name: 'getPagePrompt',
    description: 'Fetch page layout and summarize components',
    inputSchema: {
      type: 'object',
      properties: {
        path: { type: 'string' },
        site: { type: 'string' },
        locale: { type: 'string' },
      },
      required: ['path'],
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Fetch Sitecore page layout for path={{path}} site={{site}} locale={{locale}} and summarize key components.',
          },
        ],
      },
    ],
  });

  server.prompt({
    name: 'listRoutesPrompt',
    description: 'List route paths for a site/languages',
    inputSchema: {
      type: 'object',
      properties: {
        site: { type: 'string' },
        languages: { type: 'array', items: { type: 'string' } },
      },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'List route paths for site={{site}} languages={{languages}}; return a concise JSON array.',
          },
        ],
      },
    ],
  });

  server.prompt({
    name: 'getSitemapXmlPrompt',
    description: 'Retrieve sitemap XML (index or specific)',
    inputSchema: {
      type: 'object',
      properties: {
        reqHost: { type: 'string' },
        reqProtocol: { type: 'string' },
        id: { type: 'string' },
        site: { type: 'string' },
      },
      required: ['reqHost', 'reqProtocol'],
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Retrieve sitemap XML for host={{reqHost}} protocol={{reqProtocol}} site={{site}} id={{id}}.',
          },
        ],
      },
    ],
  });

  server.prompt({
    name: 'getDictionaryPrompt',
    description: 'Fetch dictionary phrases for site/locale',
    inputSchema: {
      type: 'object',
      properties: { site: { type: 'string' }, locale: { type: 'string' } },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Fetch dictionary phrases for site={{site}} locale={{locale}}; list as JSON.',
          },
        ],
      },
    ],
  });

  server.prompt({
    name: 'getRobotsPrompt',
    description: 'Fetch robots.txt for a site and summarize rules',
    inputSchema: { type: 'object', properties: { site: { type: 'string' } }, required: ['site'] },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Fetch robots.txt for site={{site}} and summarize disallow rules.',
          },
        ],
      },
    ],
  });

  server.prompt({
    name: 'getErrorPagesPrompt',
    description: 'Fetch 404/500 page configuration',
    inputSchema: {
      type: 'object',
      properties: { site: { type: 'string' }, locale: { type: 'string' } },
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Fetch 404/500 pages for site={{site}} locale={{locale}}; return JSON.',
          },
        ],
      },
    ],
  });

  server.prompt({
    name: 'listComponentsPrompt',
    description: 'Aggregate unique component names from layout',
    inputSchema: {
      type: 'object',
      properties: {
        routes: { type: 'array', items: { type: 'string' } },
        site: { type: 'string' },
        locale: { type: 'string' },
      },
      required: ['routes'],
    },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Aggregate component names for routes={{routes}} site={{site}} locale={{locale}}; return sorted JSON list.',
          },
        ],
      },
    ],
  });
}
