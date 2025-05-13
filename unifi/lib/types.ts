// Type for individual device access
interface DeviceAccess {
  type: string;
}

// Type for individual device data
interface DeviceData {
  type: string;
  id: string;
  name: string;
  connectedAt: string;
  ipAddress: string;
  macAddress: string;
  uplinkDeviceId: string;
  access: DeviceAccess;
}

// Type for the full response
interface DeviceResponse {
  offset: number;
  limit: number;
  count: number;
  totalCount: number;
  data: DeviceData[];
}

export type { DeviceResponse };
