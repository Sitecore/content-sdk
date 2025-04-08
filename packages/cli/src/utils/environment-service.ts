export const csBaseUrls = {
  staging: 'https://cs-cmapi-staging.sitecore-staging.cloud',
  preProd: 'https://cs-cmapi-preprod.sitecorecloud.io/',
  prod: 'https://cs-cmapi.sitecorecloud.io/',
};

export interface CSEnvironemnt {
  id: string;
  name: string;
  path: string;
  source: string;
  system: {
    createdAt: string;
    updatedAt: string;
  };
}

export interface CSEnvironemntCreateResource {
  id: string;
  name: string;
  source: string;
}

export class CSEnvironemntService {
  private accessToken: string;
  private baseUrl: string;
  private environmentUrl: URL;

  constructor(options: { accessToken: string; baseUrl?: string }) {
    this.accessToken = options.accessToken;
    this.baseUrl = options.baseUrl || csBaseUrls.staging;
    this.environmentUrl = new URL('/api/v2/environments', this.baseUrl);
  }

  public async getEnvironments(): Promise<CSEnvironemnt[]> {
    return this.sendRequest<CSEnvironemnt[]>({ method: 'GET' });
  }

  public async createEnvironemnt(
    environmentInput: CSEnvironemntCreateResource
  ): Promise<CSEnvironemnt> {
    return this.sendRequest<CSEnvironemnt, CSEnvironemntCreateResource>({
      method: 'POST',
      body: environmentInput,
    });
  }

  public async deleteEnvironemnt(environmentId: string): Promise<void> {
    this.sendRequest<void>({ method: 'DELETE', path: `/${environmentId}` });
  }

  private async sendRequest<TRes, TReq extends unknown | undefined = undefined>({
    body,
    method,
    path,
  }: {
    method: 'POST' | 'GET' | 'DELETE';
    path?: string;
    body?: TReq;
  }): Promise<TRes> {
    try {
      const url = path ? new URL(path, this.environmentUrl) : this.environmentUrl;

      const response = await fetch(url.toString(), {
        method,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`Error creating environment: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      return data;
    } catch (error) {
      console.error('Error creating environment:', (error as any).message);
      throw error;
    }
  }
}
