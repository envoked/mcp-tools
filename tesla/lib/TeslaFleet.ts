import * as arctic from 'arctic';

export class TeslaFleetProvider extends arctic.OAuth2Client{
  protected authorizationURL: string;

  constructor(clientId: string, clientSecret: string, redirectURI: string) {
    super(clientId, clientSecret, redirectURI);
    this.authorizationURL = "https://fleet-auth.prd.vn.cloud.tesla.com/oauth2/v3/authorize";
  }

  createAuthUrl(state: string, scopes: string[]): URL {
    return super.createAuthorizationURL(this.authorizationURL, state, scopes);
  }

  async getMe(accessToken: string) {
    const response = await fetch("https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/users/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch user info: ${response.statusText}`);
    }

    return response.json();
  }

  async getVehicles(accessToken: string) {
    const response = await fetch("https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicles: ${response.statusText}`);
    }

    return response.json();
  }

  async getVehicleData(accessToken: string, vehicleId: string, endpoints?: string[]) {
    const endpointParam = endpoints ? `?endpoints=${endpoints.join(';')}` : '';

    const response = await fetch(
      `https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles/${vehicleId}/vehicle_data${endpointParam}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch vehicle data: ${response.statusText}`);
    }

    return response.json();
  }

  async getChargeState(accessToken: string, vehicleId: string) {
    return this.getVehicleData(accessToken, vehicleId, ['charge_state']);
  }

  async getLocation(accessToken: string, vehicleId: string) {
    return this.getVehicleData(accessToken, vehicleId, ['location_data']);
  }

  async wakeVehicle(accessToken: string, vehicleId: string) {
    const response = await fetch(
      `https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles/${vehicleId}/wake_up`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to wake vehicle: ${response.statusText}`);
    }

    return response.json();
  }

  async setChargeLimit(accessToken: string, vehicleId: string, percent: number) {
    const response = await fetch(
      `https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles/${vehicleId}/command/set_charge_limit`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ percent }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to set charge limit: ${response.statusText}`);
    }

    return response.json();
  }

  async startCharging(accessToken: string, vehicleId: string) {
    const response = await fetch(
      `https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles/${vehicleId}/command/charge_start`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to start charging: ${response.statusText}`);
    }

    return response.json();
  }

  async stopCharging(accessToken: string, vehicleId: string) {
    const response = await fetch(
      `https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/vehicles/${vehicleId}/command/charge_stop`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to stop charging: ${response.statusText}`);
    }

    return response.json();
  }
}
