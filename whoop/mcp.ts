import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getWorkouts, getSleep, getCycles } from "./WhoopClient.ts";

// Create server instance
const server = new McpServer({
  name: "whoop-server",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});


server.tool(
  "get-workouts",
  "Get workouts from Whoop",
  {
    start: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    end: z.string().optional().describe("End date (YYYY-MM-DD)")
  },
  async ({ start, end }) => {
    const workouts = await getWorkouts(start, end);
    return {
      content: [
        {
          type: "text",
          text: `Workouts: ${JSON.stringify(workouts)}`
        }
      ]
    };
  }
);

server.tool(
  "get-sleep",
  "Get sleep data from Whoop",
  {
    start: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    end: z.string().optional().describe("End date (YYYY-MM-DD)")
  },
  async ({ start, end }) => {
    const sleepData = await getSleep(start, end);
    return {
      content: [
        {
          type: "text",
          text: `Sleep data: ${JSON.stringify(sleepData)}`
        }
      ]
    };
  }
);

server.tool(
  "get-cycles",
  "Get recovery cycles from Whoop",
  {
    start: z.string().optional().describe("Start date (YYYY-MM-DD)"),
    end: z.string().optional().describe("End date (YYYY-MM-DD)")
  },
  async ({ start, end }) => {
    const cycles = await getCycles(start, end);
    return {
      content: [
        {
          type: "text",
          text: `Cycles: ${JSON.stringify(cycles)}`
        }
      ]
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Whoop MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error in main:", err);
  process.exit(1);
});
