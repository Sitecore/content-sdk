import { NextApiResponse, NextApiRequest } from 'next';

/**
 * Proxy / handler for use in healthcheck Next.js API route (e.g. '/api/healthz').
 * @public
 */
export class HealthcheckProxy {
  /**
   * Gets the Next.js API route handler
   * @returns route handler
   */
  public getHandler(): (req: NextApiRequest, res: NextApiResponse) => Promise<void> {
    return this.handler;
  }

  private handler = async (_req: NextApiRequest, res: NextApiResponse): Promise<void> => {
    res.status(200).send('Healthy');
  };
}
