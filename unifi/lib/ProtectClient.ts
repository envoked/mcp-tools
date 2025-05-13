/**
 * Client for interacting with the official Unifi Protect API
 */
export default class ProtectClient {
  /**
   * Base URL for the Unifi Protect API
   */
  private static BASE_URL: string = 'https://192.168.0.1/proxy';

  /**
   * API key for authenticating requests
   */
  private static API_KEY: string = process.env.PROTECT_API_KEY || '';

  /**
   * Generates headers for API requests
   * @returns {Headers} Headers object with authentication and content type
   */
  private static getHeaders(): Headers {
    return new Headers({
      'Accept': 'application/json',
      'X-API-KEY': this.API_KEY,
    });
  }

  /**
   * Retrieves a list of clients connected to the network for a specific site.
   * @template DeviceResponse
   * @param {string} siteId - The ID of the site to retrieve clients for.
   * @returns {Promise<DeviceResponse>} A promise that resolves to the list of clients.
   */
  static async getClients<DeviceResponse>(siteId: string): Promise<DeviceResponse> {
    const endpoint = `/network/integration/v1/sites/${siteId}/clients`;
    const res = await ProtectClient.makeRequest(endpoint, 'GET');
    return res.json() as DeviceResponse;
  }

  /**
   * Retrieves details about a specific device in a site.
   * @template DeviceResponse
   * @param {string} siteId - The ID of the site.
   * @param {string} deviceId - The ID of the device to retrieve details for.
   * @returns {Promise<DeviceResponse>} A promise that resolves to the device details.
   */
  static async getClientDetails<DeviceResponse>(siteId: string, deviceId: string): Promise<DeviceResponse> {
    const endpoint = `/network/integration/v1/sites/${siteId}/devices/${deviceId}`;
    const res = await ProtectClient.makeRequest(endpoint, 'GET');
    return res.json();
  }

  /**
   * Retrieves a snapshot from a specific camera.
   * @param {string} cameraId - The ID of the camera to retrieve the snapshot from.
   * @returns {Promise<Response>} A promise that resolves to the snapshot response.
   */
  static async getSnapshot(cameraId: string): Promise<Response> {
    const endpoint = `/protect/integration/v1/cameras/${cameraId}/snapshot`;
    return await ProtectClient.makeRequest(endpoint, 'GET');
  }

  /**
   * Retrieves a list of all devices.
   * @returns {Promise<Response>} A promise that resolves to the list of devices.
   */
  static async getDeviceList(): Promise<Response> {
    const endpoint = `/protect/integration/v1/devices`;
    return await ProtectClient.makeRequest(endpoint, 'GET');
  }

  /**
   * Retrieves a list of all cameras.
   * @returns {Promise<Response>} A promise that resolves to the list of cameras.
   */
  static async getCameras(): Promise<Response> {
    const endpoint = `/protect/integration/v1/cameras`;
    return await ProtectClient.makeRequest(endpoint, 'GET');
  }

  /**
   * Updates a specific device with new data.
   * @param {string} deviceId - The ID of the device to update.
   * @param {Record<string, unknown>} data - The data to update the device with.
   * @returns {Promise<Response>} A promise that resolves to the update response.
   */
  static async updateDevice(deviceId: string, data: Record<string, unknown>): Promise<Response> {
    const endpoint = `/protect/integration/v1/devices/${deviceId}`;
    return await ProtectClient.makeRequest(endpoint, 'PUT', data);
  }

  /**
   * Retrieves a list of all sites.
   * @template SiteResponse
   * @returns {Promise<SiteResponse>} A promise that resolves to the list of sites.
   */
  static async getSites<SiteResponse>(): Promise<SiteResponse> {
    const endpoint = `/network/integration/v1/sites`;
    const res = await ProtectClient.makeRequest(endpoint, 'GET');
    return res.json() as SiteResponse;
  }

  /**
   * Makes a request to the Unifi Protect API.
   * @param {string} endpoint - The API endpoint to make the request to.
   * @param {'GET' | 'POST' | 'PUT' | 'DELETE'} method - The HTTP method to use for the request.
   * @param {Record<string, unknown>} [body] - The optional body to include in the request.
   * @returns {Promise<Response>} A promise that resolves to the response of the request.
   */
  private static async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body?: Record<string, unknown>
  ): Promise<Response> {
    const url = `${ProtectClient.BASE_URL}${endpoint}`;
    return await fetch(url, {
      method,
      credentials: 'include',
      headers: ProtectClient.getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}
