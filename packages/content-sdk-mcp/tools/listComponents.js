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

export default async function listComponentsTool({ client, args }) {
  const routes = Array.isArray(args?.routes) && args.routes.length ? args.routes : ['/'];
  const names = new Set();
  if (!client) throw new Error('Sitecore client not configured');
  for (const r of routes) {
    try {
      const page = await client.getPage(r, {
        site: args.site || undefined,
        locale: args.locale || undefined,
      });
      if (page?.layout) collectComponentNames(page.layout, names);
    } catch {
      // ignore
    }
  }
  return { components: Array.from(names).sort() };
}
