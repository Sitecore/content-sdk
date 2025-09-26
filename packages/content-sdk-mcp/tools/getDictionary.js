export default async function getDictionaryTool({ client, args }) {
  if (!client) throw new Error('Sitecore client not configured');
  return client.getDictionary({ site: args.site || undefined, locale: args.locale || undefined });
}
