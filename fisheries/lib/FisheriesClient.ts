import { fetch } from 'bun';
import type {
  FisheriesCredentials,
  FisheriesOrder,
  FisheriesOrderDetails,
  FisheriesOrderResponse,
  OrdersResponse
} from './types';

/**
 * Client for interacting with the Fisheries Supply API
 */
export class FisheriesClient {
  private baseUrl: string;
  private cookies: string[] = [];

  /**
   * Creates a new instance of the FisheriesClient
   * @param baseUrl Optional base URL for the API (defaults to fisheriessupply.com API)
   */
  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || 'https://www.fisheriessupply.com/api';
  }

  /**
   * Gets the headers for API requests including cookies if available
   * @returns Headers object with appropriate content type and cookies
   */
  private getHeaders(): Headers {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'User-Agent': 'fisheries-client/1.0',
    });

    if (this.cookies.length > 0) {
      headers.append('Cookie', this.cookies.join('; '));
    }

    return headers;
  }

  /**
   * Login to the Fisheries API
   * @param credentials User credentials
   * @returns Promise resolving to a boolean indicating success
   */
  async login(credentials: FisheriesCredentials): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/identity/signin`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Save cookies for subsequent requests
      // Parse relevant cookies from response
      const setCookieHeader = response.headers.getSetCookie() ?? [];
      const relevantCookies = Array.isArray(setCookieHeader) ? setCookieHeader.filter(cookie => {
        return cookie.includes('exp_seg=') ||
               cookie.includes('experimentation_group=') ||
               cookie.includes('com.fisheriessupply.user=') ||
               cookie.includes('com.fisheriessupply.shopper=') ||
               cookie.includes('com.fisheriessupply.gs=') ||
               cookie.includes('com.fisheriessupply.customer=') ||
               cookie.includes('cf_clearance=') ||
               cookie.includes('com.fisheriessupply.guest=');
      });
      this.cookies = relevantCookies;

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  }

  /**
   * Get orders with optional filtering parameters
   * @param limit Optional limit on the number of orders to retrieve
   * @returns Promise resolving to array of orders
   */
  async getOrders(limit: number=10): Promise<FisheriesOrder[]> {
    this.checkAuthentication();

    try {
      // Create URL with query parameters
      const url = new URL(`${this.baseUrl}/orderhistory/currentshopper/${limit}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders(),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json() as OrdersResponse;
      return data.value;
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      throw error;
    }
  }

  /**
   * Get detailed information about a specific order
   * @param orderId The ID of the order to retrieve
   * @returns Promise resolving to order details
   */
  async getOrderDetails(orderId: string): Promise<FisheriesOrderDetails[]> {
    this.checkAuthentication();

    try {
      const response = await fetch(`${this.baseUrl}/orderhistory/orderDetails`, {
        method: 'POST',
        headers: this.getHeaders(),
        credentials: 'include',
        body: JSON.stringify({'orderNo': orderId})
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const orderDetails = await response.json() as FisheriesOrderResponse;
      return orderDetails.value;

    } catch (error) {
      console.error(`Failed to fetch details for order ${orderId}:`, error);
      throw error;
    }
  }

  /**
   * Checks if the client is authenticated and throws an error if not
   * @private
   */
  private checkAuthentication(): void {
    if (this.cookies.length === 0) {
      throw new Error('Not authenticated. Call login() first.');
    }
  }
}

// Create a default client instance for backward compatibility
const defaultClient = new FisheriesClient();

// Export functions from default client for backward compatibility
export const login = (credentials: FisheriesCredentials): Promise<boolean> =>
  defaultClient.login(credentials);

export const getOrders = (limit?: number): Promise<FisheriesOrder[]> =>
  defaultClient.getOrders(limit);

export const getOrderDetails = (orderId: string): Promise<FisheriesOrderDetails[]> =>
  defaultClient.getOrderDetails(orderId);
