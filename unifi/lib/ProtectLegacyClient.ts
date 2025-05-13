/**
 * Library for interacting with the unofficial Unifi API. Sans API token.
 */

export default class ProtectLegacyClient {
  private host: string;
  private username: string;
  private password: string;
  private cookies: string[];

  constructor (host: string, username: string, password:string) {
    this.host = host;
    this.username = username;
    this.password = password;
    this.cookies = [];
  }

  async login(): Promise<boolean> {
    const endpoint = `${this.host}/api/auth/login`;
    const params = {
      username: this.username,
      password: this.password,
      rememberMe: true,
      token: "",
    };
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(params),
    });
    this.cookies = res.headers.getSetCookie();
    return true;
  }

  async searchDetections(labels: string, limit: number, offset: number, orderDirection: string = 'DESC'): Promise<Response> {
    const url = `${this.host}/proxy/protect/api/detection-search`;
    const queryParams = new URLSearchParams()
    queryParams.append('labels', labels);
    queryParams.append('limit', limit.toString());
    queryParams.append('offset', offset.toString());
    queryParams.append('orderDirection', orderDirection);

    return await fetch(`${url}?${queryParams.toString()}`, {
      credentials: 'include',
      method: 'GET',
      headers: new Headers({
        'Cookie': this.cookies.join(';')
      }),
    });
  }

  async getThumbnail(eventId: string): Promise<Response> {
    const endpoint = `/protect/api/events/${eventId}/thumbnail`;
    return this.makeRequest(endpoint, 'GET');
  }

  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: Record<string, unknown>
  ): Promise<Response> {
    const url = `${this.host}/proxy/${endpoint}`;
    return await fetch(url, {
      credentials: 'include',
      method,
      headers: new Headers({
        'Cookie': this.cookies.join(';')
      }),
      body: body ? JSON.stringify(body) : undefined,
    });
  }

}
