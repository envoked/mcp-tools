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

  /**
   * Logs in to the Unifi Protect API and stores cookies for subsequent requests.
   * @returns {Promise<boolean>} A promise that resolves to true if login is successful.
   */
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

  /**
   * Searches for detections based on the provided label, limit, offset, and order direction.
   * @param {string} label - The label to search detections for.
   * @param {number} limit - The maximum number of detections to retrieve.
   * @param {number} offset - The offset for pagination.
   * @param {string} [orderDirection='DESC'] - The order direction (e.g., 'ASC' or 'DESC').
   * @returns {Promise<Response>} A promise that resolves to the response of the detection search.
   */
  async searchDetections(label: string, limit: number, offset: number, orderDirection: string = 'DESC'): Promise<Response> {
    const url = `${this.host}/proxy/protect/api/detection-search`;
    const queryParams = new URLSearchParams()
    queryParams.append('labels', `searchDetections:${label}`);
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

  /**
   * Retrieves the thumbnail for a specific event.
   * @param {string} eventId - The ID of the event to retrieve the thumbnail for.
   * @returns {Promise<Response>} A promise that resolves to the response containing the thumbnail.
   */
  async getThumbnail(eventId: string): Promise<Response> {
    const endpoint = `/protect/api/events/${eventId}/thumbnail`;
    return this.makeRequest(endpoint, 'GET');
  }

  /**
   * Makes a request to the Unifi Protect API with the specified endpoint, method, and optional body.
   * @param {string} endpoint - The API endpoint to make the request to.
   * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method - The HTTP method to use for the request.
   * @param {Record<string, unknown>} [body] - The optional body to include in the request.
   * @returns {Promise<Response>} A promise that resolves to the response of the request.
   */
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
