import type { NextApiRequest, NextApiResponse } from 'next';
import scClient from 'lib/sitecore-client';

const sitemapApi = async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  const { id } = req.query;

  try {
    const xmlContent = await scClient.getSiteMap(req, id as string);
    
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
