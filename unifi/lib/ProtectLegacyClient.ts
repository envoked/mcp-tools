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
   * Gets the headers for API requests including cookies if available
   * @param {boolean} includeContentType - Whether to include Content-Type header
   * @returns {Headers} Headers object with appropriate headers
   */
  private getHeaders(includeContentType: boolean = false): Headers {
    const headers = new Headers({
      'Accept': 'application/json',
      'User-Agent': 'mcp-tools-unifi-protect-legacy/1.0',
    });

    if (includeContentType) {
      headers.append('Content-Type', 'application/json');
    }

    if (this.cookies.length > 0) {
      headers.append('Cookie', this.cookies.join('; '));
    }

    return headers;
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
      headers: this.getHeaders(true), // Include Content-Type
      body: JSON.stringify(params),
    });
    this.cookies = res.headers.getSetCookie();
    return true;
  }

/**
 * Searches for detections based on the provided parameters.
 * @param {Object} params - The parameters for the detection search.
 * @param {string} [params.label] - The smart detect type label to search detections for.
 * @param {number} [params.limit] - The maximum number of detections to retrieve.
 * @param {number} [params.offset] - The offset for pagination.
 * @param {string} [params.orderDirection='DESC'] - The order direction ('ASC' or 'DESC').
 * @param {string} [params.timeStart] - The start time for the search range in a format parseable by Date.parse().
 * @param {string} [params.timeEnd] - The end time for the search range in a format parseable by Date.parse().
 * @param {string[]} [params.devices] - Array of device IDs to filter the search by.
 * @returns {Promise<Response>} A promise that resolves to the response of the detection search.
 */
  async searchDetections(params: {
    label?: string;
    limit?: number;
    offset?: number;
    orderDirection?: string;
    timeStart?: string;
    timeEnd?: string;
    devices?: string[];
  } = {}): Promise<Response> {
    const {
      label,
      limit,
      offset,
      orderDirection = 'DESC',
      timeStart,
      timeEnd,
      devices
    } = params;
    const url = `${this.host}/proxy/protect/api/detection-search`;
    const queryParams = new URLSearchParams();
    queryParams.append('orderDirection', orderDirection);

    if (label) queryParams.append('labels', `smartDetectType:${label}`);
    if (typeof limit === 'number') queryParams.append('limit', limit.toString());
    if (typeof offset === 'number') queryParams.append('offset', offset.toString());

    const parsedStart = timeStart && Date.parse(timeStart);
    const parsedEnd = timeEnd && Date.parse(timeEnd);
    if (parsedStart) queryParams.append('start', parsedStart.toString());
    if (parsedEnd) queryParams.append('end', parsedEnd.toString());
    if (devices && devices.length > 0) queryParams.append('devices', devices.join(','));

    return await fetch(`${url}?${queryParams.toString()}`, {
      credentials: 'include',
      method: 'GET',
      headers: this.getHeaders(),
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
      headers: this.getHeaders(body !== undefined), // Include Content-Type if there's a body
      body: body ? JSON.stringify(body) : undefined,
    });
  }

}
