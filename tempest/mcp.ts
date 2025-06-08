import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { getForecast, getStations } from "./TempestClient.ts";
import type { TempestStationsResponse, TempestWeatherData } from "./types.ts";


// Create server instance
const server = new McpServer({
  name: "tempest-weather",
  version: "1.0.0",
  capabilities: {
    resources: {},
    tools: {},
  },
});

server.tool(
  "current-weather",
  "Get the current weather at a given station",
  {
    stationId: z.number().describe("Station id")
  },
  async({ stationId }) => {
    const weatherData = await getForecast<TempestWeatherData>(stationId);
    if (!weatherData) {
      throw new Error("Failed to fetch weather data");
    }
    return {
      content: [
        {
          type: "text",
          text: `Current observations and forecasts are ${JSON.stringify(weatherData)}`,
        }
      ]
    }
  }
);

server.tool(
 "get-stations",
  "Get List of stations available",
  {},
  async() => {
    const weatherData = await getStations<TempestStationsResponse>();
    if (!weatherData) {
      throw new Error("Failed to fetch weather data");
    }
    return {
      content: [
        {
          type: "text",
          text: `Current observations and forecasts are ${JSON.stringify(weatherData)}`,
        }
      ]
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Weather MCP Server running on stdio");
}

main().catch((err) => {
  console.error("Fatal error in main:", err);
  process.exit(1);
})
