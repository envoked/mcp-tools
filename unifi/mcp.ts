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

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Unifi MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error in main:", err);
  process.exit(1);
})
