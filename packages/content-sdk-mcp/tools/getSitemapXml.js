export default async function getSitemapXmlTool({ client, args }) {
  if (!client) throw new Error('Sitecore client not configured');
  const reqHost = args.reqHost || 'localhost';
  const reqProtocol = args.reqProtocol || 'https';
  const id = args.id || undefined;
  const siteName = args.site || undefined;
  return client.getSiteMap({ reqHost, reqProtocol, id, siteName });
}
