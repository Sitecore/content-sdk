import pingTool from './ping.js';
import listSchemasTool from './listSchemas.js';
import getPageTool from './getPage.js';
import getDictionaryTool from './getDictionary.js';
import getRobotsTool from './getRobots.js';
import getErrorPagesTool from './getErrorPages.js';
import listRoutesTool from './listRoutes.js';
import getSitemapXmlTool from './getSitemapXml.js';
import listComponentsTool from './listComponents.js';

function jsonText(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function registerTools(server, client) {
  // ping
  server.tool(
    {
      name: 'ping',
      description: 'Health check',
      inputSchema: { type: 'object', additionalProperties: false },
    },
    async () => ({ content: [{ type: 'text', text: jsonText(await pingTool({ client })) }] })
  );

  // getPage
  server.tool(
    {
      name: 'getPage',
      description: 'Fetch Sitecore page details for a route path',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          path: { type: 'string', description: 'Route path, e.g. /' },
          site: { type: 'string', nullable: true },
          locale: { type: 'string', nullable: true },
        },
        required: ['path'],
      },
    },
    async (args) => {
      try {
        const result = await getPageTool({ client, args });
        return { content: [{ type: 'text', text: jsonText(result) }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );

  // getDictionary
  server.tool(
    {
      name: 'getDictionary',
      description: 'Fetch Sitecore dictionary phrases',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          site: { type: 'string', nullable: true },
          locale: { type: 'string', nullable: true },
        },
      },
    },
    async (args) => {
      try {
        const result = await getDictionaryTool({ client, args });
        return { content: [{ type: 'text', text: jsonText(result) }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );

  // getRobots
  server.tool(
    {
      name: 'getRobots',
      description: 'Fetch robots.txt content for a site',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: { site: { type: 'string' } },
        required: ['site'],
      },
    },
    async (args) => {
      try {
        const robots = await getRobotsTool({ client, args });
        return { content: [{ type: 'text', text: robots }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );

  // listRoutes
  server.tool(
    {
      name: 'listRoutes',
      description: 'List site routes via getPagePaths',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          site: { type: 'string', nullable: true },
          languages: { type: 'array', items: { type: 'string' }, nullable: true },
        },
      },
    },
    async (args) => {
      try {
        const result = await listRoutesTool({ client, args });
        return { content: [{ type: 'text', text: jsonText(result) }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );

  // getSitemapXml
  server.tool(
    {
      name: 'getSitemapXml',
      description: 'Return sitemap XML via getSiteMap',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          reqHost: { type: 'string' },
          reqProtocol: { type: 'string' },
          id: { type: 'string', nullable: true },
          site: { type: 'string', nullable: true },
        },
        required: ['reqHost', 'reqProtocol'],
      },
    },
    async (args) => {
      try {
        const xml = await getSitemapXmlTool({ client, args });
        return { content: [{ type: 'text', text: xml }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );

  // getErrorPages
  server.tool(
    {
      name: 'getErrorPages',
      description: 'Fetch SXA error pages configuration',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          site: { type: 'string', nullable: true },
          locale: { type: 'string', nullable: true },
        },
      },
    },
    async (args) => {
      try {
        const result = await getErrorPagesTool({ client, args });
        return { content: [{ type: 'text', text: jsonText(result) }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );

  // listSchemas
  server.tool(
    {
      name: 'listSchemas',
      description: 'Show configured connection details',
      inputSchema: { type: 'object', additionalProperties: false },
    },
    async () => ({ content: [{ type: 'text', text: jsonText(await listSchemasTool()) }] })
  );

  // listComponents
  server.tool(
    {
      name: 'listComponents',
      description: 'Aggregate unique component names from layout',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          routes: { type: 'array', items: { type: 'string' }, nullable: true },
          site: { type: 'string', nullable: true },
          locale: { type: 'string', nullable: true },
        },
      },
    },
    async (args) => {
      try {
        const result = await listComponentsTool({ client, args });
        return { content: [{ type: 'text', text: jsonText(result) }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );
}
