import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import ProtectClient from "./lib/ProtectClient";
import { DeviceResponse } from "./lib/types";
import z from 'zod';


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
    let res:DeviceResponse = await ProtectClient.getClients('88f7af54-98f8-306a-a1c7-c9349722b1f6');
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
    let res = await ProtectClient.getClientDetails('88f7af54-98f8-306a-a1c7-c9349722b1f6', deviceId);
    return {
      content: [
        {
          type: "text",
          text: `: ${JSON.stringify(res)}`,
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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Unifi MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error in main:", err);
  process.exit(1);
})
