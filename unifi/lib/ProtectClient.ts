/**
 * Client for interacting with the official Unifi Protect API
 */
import { DeviceResponse } from "./types";

export default class ProtectClient {
  private static BASE_URL: string = 'https://192.168.0.1/proxy';
  private static API_KEY: string = process.env.PROTECT_API_KEY || '';

  private static getHeaders(): Headers {
    return new Headers({
      'Accept': 'application/json',
      'X-API-KEY': this.API_KEY,
    });
  }

  static async getClients<DeviceResponse>(siteId: string): Promise<DeviceResponse> {
    const endpoint = `/network/integration/v1/sites/${siteId}/clients`;
    const res = await ProtectClient.makeRequest(endpoint, 'GET');
    return res.json() as DeviceResponse;
  }

  static async getClientDetails<DeviceResponse>(siteId: string, deviceId: string): Promise<DeviceResponse> {
    const endpoint = `/network/integration/v1/sites/${siteId}/devices/${deviceId}`;
    const res = await ProtectClient.makeRequest(endpoint, 'GET');
    return res.json();
  }

  static async getSnapshot(cameraId: string ): Promise<Response> {
    const endpoint = `/protect/integration/v1/cameras/${cameraId}/snapshot`;
    return await ProtectClient.makeRequest(endpoint, 'GET');
  }

  static async getDeviceList(): Promise<Response> {
    const endpoint = `/protect/integration/v1/devices`;
    return await ProtectClient.makeRequest(endpoint, 'GET');
  }

  static async getCameras(): Promise<Response> {
    const endpoint = `/protect/integration/v1/cameras`;
    return await ProtectClient.makeRequest(endpoint, 'GET');
  }

  static async updateDevice(deviceId: string, data: Record<string, unknown>): Promise<Response> {
    const endpoint = `/protect/integration/v1/devices/${deviceId}`;
    return await ProtectClient.makeRequest(endpoint, 'PUT', data);
  }

  static async detectionSearch(labels: string, limit: number, offset: number, orderDirection: string = 'DESC') {
    const endpoint = `/protect/api/detection-search`;
    const queryParams = new URLSearchParams()
    queryParams.append('labels', labels);
    queryParams.append('limit', limit.toString());
    queryParams.append('offset', offset.toString());
    queryParams.append('orderDirection', orderDirection);
    return await ProtectClient.makeRequest(`${endpoint}?${queryParams.toString()}`, 'GET');
  }

  static async getThumbnail(eventId: string): Promise<Response> {
    const endpoint = `/protect/api/events/${eventId}/thumbnail`;
    return await ProtectClient.makeRequest(endpoint, 'GET');
  }

  static async login(username?: string, password?: string): Promise<Response> {
    const endpoint = `https://192.168.0.1/api/auth/login`;
    const params = {
      username,
      password,
      rememberMe: true,
      token:"",
    };
    return await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }


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
