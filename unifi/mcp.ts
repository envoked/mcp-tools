import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import ProtectClient from "./lib/ProtectClient";
import ProtectLegacyClient from "./lib/ProtectLegacyClient";
import { DeviceResponse } from "./lib/types";
import z from 'zod';

const { UNIFI_USERNAME, UNIFI_PASSWORD, UNIFI_SITE_ID } = Bun.env;

// Make sure env variables are set
if (!UNIFI_SITE_ID || !UNIFI_USERNAME || !UNIFI_PASSWORD) {
  throw new Error("UNIFI_USERNAME and UNIFI_PASSWORD environment variables must be set");
}

// Create server instance
const server = new McpServer({
  name: "unifi",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "get-network-clients",
  "Get a list of current clients connected to the network",
  async() => {
    let res:DeviceResponse = await ProtectClient.getClients(UNIFI_SITE_ID);
    return {
      content: [
        {
          type: "text",
          text: `Current clients connected to the network: ${JSON.stringify(res.data)}`,
        }
      ]
    }
  }
);

server.tool(
  "get-device-details",
  "Get details about a Unifi device like router, camera, etc.",
  {
    deviceId: z.string().describe("Station id")
  },
  async({ deviceId }) => {
    let res = await ProtectClient.getClientDetails(UNIFI_SITE_ID, deviceId);
    return {
      content: [
        {
          type: "text",
          text: `Device Details: ${JSON.stringify(res)}`,
        }
      ]
    }
  }
);

server.tool(
  "get-cameras",
  "Get a list of all cameras connected",
  async() => {
    let res = await ProtectClient.getCameras();
    const data = await res.json()
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data)
        }
      ]
    }
  }
);
server.tool(
  "get-camera-snapshot",
  "Get a snapshot from a given camera",
  {
    cameraId: z.string().describe("cameraId")
  },
  async({ cameraId }) => {
    let res = await ProtectClient.getSnapshot(cameraId);
    const data = await res.arrayBuffer()
    const base64String = Buffer.from(data).toString('base64');
    return {
      content: [
        {
          type: "image",
          data: base64String,
          mimeType: "image/jpeg"
        }
      ]
    }
  }
);

server.tool(
  "get-detection-thumbnail",
  "Get a thumbnail of a detection",
  {
    eventId: z.string().describe("eventId")
  },
  async({ eventId }) => {
    let client = new ProtectLegacyClient('https://192.168.0.1', UNIFI_USERNAME, UNIFI_PASSWORD);
    const isLogin = await client.login();
    const res = await client.getThumbnail(eventId);
    if (!res.body) {
      throw new Error("Response body is null");
    }
    const arrBuff = await Bun.readableStreamToArrayBuffer(res.body);
    const base64String = Buffer.from(arrBuff).toString('base64');
    return {
      content: [
        {
          type: "image",
          data: base64String,
          mimeType: "image/jpeg"
        }
      ]
    }
  }
);

server.tool(
  "get-detections",
  "Get the n detections of detectType between start and end",
  {
    detectType: z.enum(["vehicle", "person"]).describe("Detection type (vehicle or person)"),
    limit: z.number().describe("limit"),
    timeStart: z.string().describe("start date in YYYY.MM.DD format"),
    timeEnd: z.string().describe("end date in YYYY.MM.DD format"),
    cameras: z.array(z.string()).describe('List of camera device ids'),
  },
  async({ detectType, limit, timeStart, timeEnd, cameras }) => {
    let client = new ProtectLegacyClient('https://192.168.0.1', UNIFI_USERNAME, UNIFI_PASSWORD);
    const isLogin = await client.login();
    let detections:any[] = [];
    if (isLogin) {
      let res = await client.searchDetections({
        label: detectType,
        limit: limit,
        offset: 0,
        orderDirection: 'DESC',
        timeStart: timeStart,
        timeEnd: timeEnd,
        devices: cameras.map(c => `camera:${c}`)
      });
      let events = await res.json();
      detections = events.events;
    }
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(detections),
        }
      ]
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Unifi MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error in main:", err);
  process.exit(1);
})
