import type { NextApiRequest, NextApiResponse } from 'next';
import { SitemapXmlOptions } from '@sitecore-content-sdk/nextjs';
import scClient from 'lib/sitecore-client';

const sitemapApi = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
  const reqHost = req.headers.host || '';
  const reqProtocol = req.headers['x-forwarded-proto'] || 'https';

  try {
    const xmlContent = await scClient.getSiteMap({ reqHost, reqProtocol, id } as SitemapXmlOptions);

    res.setHeader('Content-Type', 'text/xml;charset=utf-8');
    res.send(xmlContent);
  } catch (error) {
    if (error instanceof Error && error.message === 'REDIRECT_404') {
      res.redirect('/404');
    } else {
      res.status(500).end('Internal Server Error');
    }
  }
};

export default sitemapApi;
