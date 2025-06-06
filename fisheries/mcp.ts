import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { FisheriesClient } from "./lib/FisheriesClient";
import { z } from 'zod';

const { FISHERIES_USERNAME, FISHERIES_PASSWORD } = Bun.env;

// Make sure env variables are set
if (!FISHERIES_USERNAME || !FISHERIES_PASSWORD) {
  throw new Error("FISHERIES_USERNAME and FISHERIES_PASSWORD environment variables must be set");
}

// Create server instance
const server = new McpServer({
  name: "fisheries",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

// Create a client instance
const client = new FisheriesClient();

// Login on startup
let isAuthenticated = false;
async function authenticate() {
  isAuthenticated = await client.login({
    email: FISHERIES_USERNAME as string,
    password: FISHERIES_PASSWORD as string
  });
  if (!isAuthenticated) {
    throw new Error("Failed to authenticate with Fisheries API");
  }
  console.error("Successfully authenticated with Fisheries API");
}

server.tool(
  "get-orders",
  "Get a list of orders from Fisheries Supply",
  {
    limit: z.number().optional().describe("Optional limit on number of orders to retrieve")
  },
  async({ limit }) => {
    if (!isAuthenticated) {
      await authenticate();
    }

    try {
      const orders = await client.getOrders(limit);
      return {
        content: [
          {
            type: "text",
            text: `Orders from Fisheries Supply: ${JSON.stringify(orders)}`,
          }
        ]
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error("Error fetching orders:", errorMessage);
      throw new Error(`Failed to fetch orders: ${errorMessage}`);
    }
  }
);

server.tool(
  "get-order-details",
  "Get detailed information about a specific order",
  {
    orderId: z.string().describe("The ID of the order to retrieve details for")
  },
  async({ orderId }) => {
    if (!isAuthenticated) {
      await authenticate();
    }

    try {
      const orderDetails = await client.getOrderDetails(orderId);
      return {
        content: [
          {
            type: "text",
            text: `Order details: ${JSON.stringify(orderDetails)}`,
          }
        ]
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Failed to fetch details for order ${orderId}:`, errorMessage);
      throw new Error(`Failed to fetch order details: ${errorMessage}`);
    }
  }
);

async function main() {
  // Authenticate on startup
  await authenticate();

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Fisheries MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error in main:", err);
  process.exit(1);
})
