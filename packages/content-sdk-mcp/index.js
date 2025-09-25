#!/usr/bin/env node

import 'dotenv/config';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
import { pathToFileURL, fileURLToPath } from 'url';
// Resolve MCP SDK imports dynamically to handle version/path differences
/**
 * Load MCP SDK Server and stdio transport constructors with path fallbacks.
 * @returns {Promise<{ Server: any, StdioServerTransport: any }>} constructors
 */
async function loadMcpSdk() {
  const serverCandidates = [
    '@modelcontextprotocol/sdk/server',
    '@modelcontextprotocol/sdk/server/index.js',
    '@modelcontextprotocol/sdk/dist/server/index.js',
    '@modelcontextprotocol/sdk/dist/server.js',
  ];
  const stdioCandidates = [
    '@modelcontextprotocol/sdk/transports/stdio',
    '@modelcontextprotocol/sdk/transports/stdio/index.js',
    '@modelcontextprotocol/sdk/dist/transports/stdio/index.js',
    '@modelcontextprotocol/sdk/dist/transports/stdio.js',
  ];

  let ServerCtor;
  let StdioCtor;

  for (const mod of serverCandidates) {
    try {
      const resolved = require.resolve(mod);
      const m = await import(pathToFileURL(resolved).href);
      ServerCtor = m.Server || m.default || ServerCtor;
      if (ServerCtor) break;
    } catch (err) {
      if (process.env.DEBUG_MCP_IMPORTS) {
        console.warn('[mcp] failed to import', mod, String(err && err.message ? err.message : err));
      }
    }
  }
  for (const mod of stdioCandidates) {
    try {
      const resolved = require.resolve(mod);
      const m = await import(pathToFileURL(resolved).href);
      StdioCtor = m.StdioServerTransport || m.default || StdioCtor;
      if (StdioCtor) break;
    } catch (err) {
      if (process.env.DEBUG_MCP_IMPORTS) {
        console.warn('[mcp] failed to import', mod, String(err && err.message ? err.message : err));
      }
    }
  }
  if (!ServerCtor || !StdioCtor) {
    throw new Error('Failed to load MCP SDK Server or Stdio transport');
  }
  return { Server: ServerCtor, StdioServerTransport: StdioCtor };
}

// Import Sitecore client from CJS subpath (works under ESM via default export)
/**
 * Load SitecoreClient from workspace package or installed package with fallbacks.
 * @returns {Promise<any | undefined>} SitecoreClient constructor or undefined
 */
async function loadSitecoreClientCtor() {
  const candidates = [
    '@sitecore-content-sdk/core/client',
    '@sitecore-content-sdk/core/client.js',
    // workspace fallbacks
    new URL('../../core/client.js', import.meta.url).href,
    new URL('../../core/dist/cjs/client/index.js', import.meta.url).href,
    new URL('../../core/dist/esm/client/index.js', import.meta.url).href,
  ];
  for (const mod of candidates) {
    try {
      let m;
      if (mod.startsWith('file:')) {
        // Use CJS require for workspace file path for reliable interop
        const fsPath = fileURLToPath(mod);
        m = require(fsPath);
      } else {
        const resolved = (() => {
          try {
            return pathToFileURL(require.resolve(mod)).href;
          } catch {
            return mod;
          }
        })();
        m = await import(resolved);
      }
      const ctor = (m && (m.SitecoreClient || m.default?.SitecoreClient)) || m?.default;
      if (process.env.DEBUG_MCP_IMPORTS) {
        console.warn(
          '[mcp] tried core client candidate:',
          mod,
          'loaded:',
          Boolean(m),
          'ctor:',
          Boolean(ctor)
        );
      }
      if (ctor) return ctor;
    } catch (err) {
      if (process.env.DEBUG_MCP_IMPORTS) {
        console.warn(
          '[mcp] failed to import core client from',
          mod,
          String(err && err.message ? err.message : err)
        );
      }
    }
  }
  if (process.env.DEBUG_MCP_IMPORTS) {
    console.warn('[mcp] SitecoreClient not found in any candidate');
  }
  return undefined;
}

/**
 * Load DefaultRetryStrategy from core (optional)
 */
async function loadDefaultRetryStrategyCtor() {
  const candidates = [
    '@sitecore-content-sdk/core',
    new URL('../../core/src/index.ts', import.meta.url).href,
    new URL('../../core/dist/cjs/index.js', import.meta.url).href,
    new URL('../../core/dist/esm/index.js', import.meta.url).href,
  ];
  for (const mod of candidates) {
    try {
      let m;
      if (mod.startsWith('file:')) {
        const fsPath = fileURLToPath(mod);
        m = require(fsPath);
      } else {
        const resolved = (() => {
          try {
            return pathToFileURL(require.resolve(mod)).href;
          } catch {
            return mod;
          }
        })();
        m = await import(resolved);
      }
      const ctor = m.DefaultRetryStrategy || m.default?.DefaultRetryStrategy;
      if (ctor) return ctor;
    } catch (err) {
      if (process.env.DEBUG_MCP_IMPORTS) {
        console.warn(
          '[mcp] failed to import DefaultRetryStrategy from',
          mod,
          String(err && err.message ? err.message : err)
        );
      }
    }
  }
  return undefined;
}

/**
 * Create a Sitecore client from environment variables if available.
 * Falls back to undefined when not configured, enabling demo mode.
 */
async function createClientFromEnv() {
  try {
    const SitecoreClient = await loadSitecoreClientCtor();
    const DefaultRetryStrategy = await loadDefaultRetryStrategyCtor();
    if (!SitecoreClient) return undefined;

    const defaultLanguage = process.env.SITECORE_DEFAULT_LANGUAGE || 'en';
    const defaultSite = process.env.SITECORE_DEFAULT_SITE || 'test';

    const edgeContextId = process.env.SITECORE_EDGE_CONTEXT_ID;
    const edgeClientContextId = process.env.SITECORE_EDGE_CLIENT_CONTEXT_ID;
    const edgeUrl = process.env.SITECORE_EDGE_URL;

    const apiHost = process.env.SITECORE_API_HOST;
    const apiKey = process.env.SITECORE_API_KEY;
    const path = process.env.SITECORE_GRAPHQL_PATH;

    const init = {
      defaultLanguage,
      defaultSite,
      api: {},
      retries: DefaultRetryStrategy
        ? { count: 3, retryStrategy: new DefaultRetryStrategy() }
        : { count: 0, retryStrategy: { shouldRetry: () => false } },
      layout: { formatLayoutQuery: null },
      dictionary: { caching: { enabled: true, timeout: 60000 } },
    };

    if (edgeContextId) {
      init.api.edge = {
        contextId: edgeContextId,
        // clientContextId is optional (server-side only)
        clientContextId: edgeClientContextId || undefined,
        edgeUrl,
      };
    } else if (apiHost && apiKey) {
      init.api.local = {
        apiHost,
        apiKey,
        path,
      };
    } else {
      return undefined;
    }

    if (process.env.DEBUG_MCP_IMPORTS) {
      console.warn('[mcp] creating SitecoreClient with init:', JSON.stringify(init));
    }
    return new SitecoreClient(init);
  } catch (e) {
    if (process.env.DEBUG_MCP_IMPORTS) {
      console.warn(
        '[mcp] failed to create SitecoreClient:',
        String(e && e.message ? e.message : e)
      );
    }
    return undefined;
  }
}

/**
 * Serialize data to pretty JSON text for MCP content messages.
 * @param {unknown} value
 */
function jsonText(value) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function collectComponentNames(obj, out) {
  if (!obj || typeof obj !== 'object') return;
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (k === 'componentName' && typeof v === 'string') {
      out.add(v);
    } else if (v && typeof v === 'object') {
      collectComponentNames(v, out);
    }
  }
}

/**
 * CLI call mode: run a single tool and output JSON, then exit.
 */
async function runCliCall(argv) {
  const cmd = argv[2];
  const tool = argv[3];
  const rawArgs = argv[4] || '{}';
  if (cmd !== 'call' || !tool) {
    console.error('Usage: node index.js call <toolName> <jsonArgs>');
    process.exit(2);
  }

  let args;
  try {
    args = JSON.parse(rawArgs);
  } catch (e) {
    console.error('Invalid JSON args:', e?.message || String(e));
    process.exit(2);
  }

  const client = await createClientFromEnv();
  const hasClient = Boolean(client);

  async function resolveResult() {
    switch (tool) {
      case 'ping':
        return { ok: true, mode: hasClient ? 'client' : 'demo' };
      case 'listSchemas':
        return {
          edge: {
            contextId: process.env.SITECORE_EDGE_CONTEXT_ID || null,
            clientContextId: process.env.SITECORE_EDGE_CLIENT_CONTEXT_ID || null,
            edgeUrl: process.env.SITECORE_EDGE_URL || null,
          },
          local: {
            apiHost: process.env.SITECORE_API_HOST || null,
            apiKey: process.env.SITECORE_API_KEY ? '***' : null,
            path: process.env.SITECORE_GRAPHQL_PATH || '/sitecore/api/graph/edge',
          },
        };
      case 'getPage': {
        if (!hasClient) {
          return {
            layout: { sitecore: { route: { name: 'Home', placeholders: {} } } },
            siteName: 'demo',
            locale: 'en',
            mode: 'Normal',
          };
        }
        return client.getPage(args.path, {
          site: args.site || undefined,
          locale: args.locale || undefined,
        });
      }
      case 'getDictionary': {
        if (!hasClient) return { phrases: { Hello: 'Hello', Welcome: 'Welcome' } };
        return client.getDictionary({
          site: args.site || undefined,
          locale: args.locale || undefined,
        });
      }
      case 'getRobots': {
        if (!hasClient) return 'User-agent: *\nDisallow:';
        return (await client.getRobots(args.site)) || '';
      }
      case 'getErrorPages': {
        if (!hasClient) return { notFound: '/not-found', serverError: '/error' };
        return client.getErrorPages({
          site: args.site || undefined,
          locale: args.locale || undefined,
        });
      }
      case 'listRoutes': {
        if (!hasClient) return { routes: [] };
        const site = args.site || undefined;
        const languages = Array.isArray(args.languages) ? args.languages : undefined;
        const paths = await client.getPagePaths(site ? [site] : [], languages);
        return { routes: paths };
      }
      case 'getSitemapXml': {
        if (!hasClient) return '<sitemapindex></sitemapindex>';
        const reqHost = args.reqHost || 'localhost';
        const reqProtocol = args.reqProtocol || 'https';
        const id = args.id || undefined;
        const siteName = args.site || undefined;
        const xml = await client.getSiteMap({ reqHost, reqProtocol, id, siteName });
        return xml;
      }
      case 'listComponents': {
        const routes = Array.isArray(args?.routes) && args.routes.length ? args.routes : ['/'];
        const names = new Set();
        if (!hasClient) return { components: [] };
        for (const r of routes) {
          try {
            const page = await client.getPage(r, {
              site: args.site || undefined,
              locale: args.locale || undefined,
            });
            if (page?.layout) collectComponentNames(page.layout, names);
          } catch {
            // ignore per-route errors
          }
        }
        return { components: Array.from(names).sort() };
      }
      default:
        throw new Error(`Unknown tool: ${tool}`);
    }
  }

  try {
    const result = await resolveResult();
    console.log(jsonText({ tool, args, result }));
    process.exit(0);
  } catch (e) {
    console.error(jsonText({ tool, args, error: String(e?.message || e) }));
    process.exit(1);
  }
}

/**
 * Entry point: registers tools and connects over stdio transport.
 */
async function main() {
  // CLI call mode
  if (process.argv[2] === 'call') {
    await runCliCall(process.argv);
    return;
  }
  const client = await createClientFromEnv();
  const hasClient = Boolean(client);

  // Optional self-test mode: run basic checks and exit without loading MCP SDK
  if (process.env.MCP_SELFTEST === '1') {
    const out = [];
    out.push({ test: 'ping', result: { ok: true, mode: hasClient ? 'client' : 'demo' } });
    out.push({
      test: 'listSchemas',
      result: {
        edge: {
          contextId: process.env.SITECORE_EDGE_CONTEXT_ID || null,
          clientContextId: process.env.SITECORE_EDGE_CLIENT_CONTEXT_ID || null,
          edgeUrl: process.env.SITECORE_EDGE_URL || null,
        },
        local: {
          apiHost: process.env.SITECORE_API_HOST || null,
          apiKey: process.env.SITECORE_API_KEY ? '***' : null,
          path: process.env.SITECORE_GRAPHQL_PATH || '/sitecore/api/graph/edge',
        },
      },
    });
    if (hasClient) {
      try {
        const page = await client.getPage('/', {});
        out.push({ test: 'getPage', ok: true, hasLayout: Boolean(page && page.layout) });
      } catch (e) {
        out.push({ test: 'getPage', ok: false, error: String(e?.message || e) });
      }
      try {
        const dict = await client.getDictionary({});
        out.push({ test: 'getDictionary', ok: true, size: dict ? Object.keys(dict).length : 0 });
      } catch (e) {
        out.push({ test: 'getDictionary', ok: false, error: String(e?.message || e) });
      }
    }
    console.log(JSON.stringify({ selftest: true, results: out }, null, 2));
    return;
  }

  const { Server, StdioServerTransport } = await loadMcpSdk();
  const server = new Server({
    name: '@sitecore-content-sdk/mcp-server',
    version: '0.1.0',
  });

  // Health check
  server.tool(
    {
      name: 'ping',
      description: 'Health check for the Sitecore MCP server',
      inputSchema: { type: 'object', additionalProperties: false },
    },
    async () => ({
      content: [
        { type: 'text', text: 'pong' },
        { type: 'text', text: hasClient ? 'client:configured' : 'client:demo-fallback' },
      ],
    })
  );

  // Get page layout data for a route
  server.tool(
    {
      name: 'getPage',
      description:
        'Fetch Sitecore page details (layout, site, locale) for a given route path. Uses configured Sitecore connection or returns demo fallback.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          path: { type: 'string', description: 'Route path, e.g. / or /products' },
          site: { type: 'string', nullable: true },
          locale: { type: 'string', nullable: true },
        },
        required: ['path'],
      },
    },
    async (args) => {
      if (!hasClient) {
        return {
          content: [
            {
              type: 'text',
              text: jsonText({
                layout: { sitecore: { route: { name: 'Home', placeholders: {} } } },
                siteName: 'demo',
                locale: 'en',
                mode: 'Normal',
              }),
            },
          ],
        };
      }
      try {
        const result = await client.getPage(args.path, {
          site: args.site || undefined,
          locale: args.locale || undefined,
        });
        return { content: [{ type: 'text', text: jsonText(result) }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );

  // Get dictionary phrases
  server.tool(
    {
      name: 'getDictionary',
      description: 'Fetch Sitecore dictionary phrases for a site/locale.',
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
      if (!hasClient) {
        return {
          content: [
            { type: 'text', text: jsonText({ phrases: { Hello: 'Hello', Welcome: 'Welcome' } }) },
          ],
        };
      }
      try {
        const result = await client.getDictionary({
          site: args.site || undefined,
          locale: args.locale || undefined,
        });
        return { content: [{ type: 'text', text: jsonText(result) }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );

  // Get robots.txt
  server.tool(
    {
      name: 'getRobots',
      description: 'Fetch robots.txt content for a given site name.',
      inputSchema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          site: { type: 'string' },
        },
        required: ['site'],
      },
    },
    async (args) => {
      if (!hasClient) {
        return { content: [{ type: 'text', text: 'User-agent: *\nDisallow:' }] };
      }
      try {
        const robots = await client.getRobots(args.site);
        return { content: [{ type: 'text', text: robots || '' }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );

  // List routes using Sitecore getPagePaths
  server.tool(
    {
      name: 'listRoutes',
      description: 'List site routes via getPagePaths (optionally filter languages).',
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
      if (!client) {
        return { content: [{ type: 'text', text: jsonText({ routes: [] }) }] };
      }
      try {
        const site = args.site || undefined;
        const languages = Array.isArray(args.languages) ? args.languages : undefined;
        const paths = await client.getPagePaths(site ? [site] : [], languages);
        return { content: [{ type: 'text', text: jsonText({ routes: paths }) }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );

  // Get sitemap XML
  server.tool(
    {
      name: 'getSitemapXml',
      description: 'Return sitemap XML (or index) via getSiteMap.',
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
      if (!client) {
        return { content: [{ type: 'text', text: '<sitemapindex></sitemapindex>' }] };
      }
      try {
        const xml = await client.getSiteMap({
          reqHost: args.reqHost,
          reqProtocol: args.reqProtocol,
          id: args.id || undefined,
          siteName: args.site || undefined,
        });
        return { content: [{ type: 'text', text: xml }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );

  // Get error pages (404/500) for a site/locale
  server.tool(
    {
      name: 'getErrorPages',
      description: 'Fetch Sitecore error pages (404/500) configured for a site/locale.',
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
      if (!hasClient) {
        return {
          content: [
            { type: 'text', text: jsonText({ notFound: '/not-found', serverError: '/error' }) },
          ],
        };
      }
      try {
        const result = await client.getErrorPages({
          site: args.site || undefined,
          locale: args.locale || undefined,
        });
        return { content: [{ type: 'text', text: jsonText(result) }] };
      } catch (err) {
        return { content: [{ type: 'text', text: `error: ${err?.message || String(err)}` }] };
      }
    }
  );

  // Utility/demo tools
  server.tool(
    {
      name: 'listSchemas',
      description:
        'List configured Sitecore GraphQL endpoints based on environment (edge/local). Useful for debugging and demos.',
      inputSchema: { type: 'object', additionalProperties: false },
    },
    async () => {
      const data = {
        edge: {
          contextId: process.env.SITECORE_EDGE_CONTEXT_ID || null,
          clientContextId: process.env.SITECORE_EDGE_CLIENT_CONTEXT_ID || null,
          edgeUrl: process.env.SITECORE_EDGE_URL || null,
        },
        local: {
          apiHost: process.env.SITECORE_API_HOST || null,
          apiKey: process.env.SITECORE_API_KEY ? '***' : null,
          path: process.env.SITECORE_GRAPHQL_PATH || '/sitecore/api/graph/edge',
        },
      };
      return { content: [{ type: 'text', text: jsonText(data) }] };
    }
  );

  // Register helpful prompt templates if supported by the SDK
  if (typeof server.prompt === 'function') {
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
  }

  await server.connect(new StdioServerTransport());
}

main().catch((err) => {
  console.error('Error starting MCP server:', err);
  process.exit(1);
});

