export async function GET() {
  return Response.json({
    sitemap: 'https://www.sitecore.com/sitemap.xml',
  });
}
